import {Action, bindActionCreators, Reducer} from 'redux';
import {AppThunkAction} from './';
import {fetchWorkspaces, startWorkspace, stopWorkspace} from '../services/api/workspaces';
import {container} from '../inversify.config';
import {CheJsonRpcApi} from '../services/json-rpc/JsonRpcApiFactory';
import {CheBranding} from '../services/bootstrap/CheBranding';
import {JsonRpcMasterApi} from "../services/json-rpc/JsonRpcMasterApi";

// This state defines the type of data maintained in the Redux store.
export interface WorkspacesState {
    isLoading: boolean;
    startDateIndex?: number;
    workspaces: che.IWorkspace[];
}

interface RequestWorkspacesAction {
    type: 'REQUEST_WORKSPACES';
    startDateIndex: number;
}

interface ReceiveWorkspacesAction {
    type: 'RECEIVE_WORKSPACES';
    startDateIndex: number;
    workspaces: che.IWorkspace[];
}
interface UpdateWorkspaceAction {
    type: 'UPDATE_WORKSPACE';
    startDateIndex: number;
    workspace: che.IWorkspace;
}

type KnownAction = RequestWorkspacesAction | ReceiveWorkspacesAction | UpdateWorkspaceAction;

enum WorkspaceStatus { RUNNING = 1, STOPPED, PAUSED, STARTING, STOPPING, ERROR}
const cheJsonRpcApi = container.get(CheJsonRpcApi);
const cheBranding = container.get(CheBranding);
let jsonRpcMasterApi: JsonRpcMasterApi;

// TODO change this test implementation to the real one
const jsonRpcApiLocation = new URL(window.location.href).origin.replace('http', 'ws') + cheBranding.all.websocketContext;

export type IActionCreators = {
    requestWorkspaces: (startDateIndex: number) => any;
    startWorkspace: (workspace: string, startDateIndex: number) => any;
    stopWorkspace: (workspace: string, startDateIndex: number) => any;
}
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators: IActionCreators = {
    // TODO finish with 'startDateIndex' implementation
    requestWorkspaces: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Lazy initialization of jsonRpcMasterApi
        if (!jsonRpcMasterApi) {
            jsonRpcMasterApi = cheJsonRpcApi.getJsonRpcMasterApi(jsonRpcApiLocation);
        }
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.workspaces && startDateIndex !== appState.workspaces.startDateIndex) {
            fetchWorkspaces()
                .then(workspaces => {
                    jsonRpcMasterApi.unSubscribeAllWorkspaceStatus();
                    workspaces.forEach(workspace => {
                        jsonRpcMasterApi.subscribeWorkspaceStatus(workspace.id as string, (message: any) => {
                            const status = message.error ? 'ERROR' : message.status;
                            if (WorkspaceStatus[status]) {
                                workspace.status = status;
                                dispatch({type: 'UPDATE_WORKSPACE', startDateIndex, workspace});
                            }
                        });
                    });
                    dispatch({type: 'RECEIVE_WORKSPACES', startDateIndex, workspaces});
                });
            dispatch({type: 'REQUEST_WORKSPACES', startDateIndex});
        }
    },
    startWorkspace: (workspaceId: string, startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.workspaces && startDateIndex !== appState.workspaces.startDateIndex) {
            startWorkspace(workspaceId)
                .then(workspace => {
                    if (workspace) {
                        dispatch({type: 'UPDATE_WORKSPACE', startDateIndex, workspace});
                    }
                });
            dispatch({type: 'REQUEST_WORKSPACES', startDateIndex: startDateIndex});
        }
    },
    stopWorkspace: (workspaceId: string, startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.workspaces && startDateIndex !== appState.workspaces.startDateIndex) {
            stopWorkspace(workspaceId)
                .then(workspace => {
                    if (workspace) {
                        dispatch({type: 'UPDATE_WORKSPACE', startDateIndex, workspace});
                    }
                });
            dispatch({type: 'REQUEST_WORKSPACES', startDateIndex: startDateIndex});
        }
    }
};

const unloadedState: WorkspacesState = {workspaces: [], isLoading: false};

export const reducer: Reducer<WorkspacesState> = (state: WorkspacesState | undefined, incomingAction: Action): WorkspacesState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_WORKSPACES':
            return {
                startDateIndex: action.startDateIndex,
                workspaces: state.workspaces,
                isLoading: true
            };
        case 'UPDATE_WORKSPACE':
            return {
                startDateIndex: action.startDateIndex,
                workspaces: <[]>state.workspaces.map((workspace: che.IWorkspace) => {
                    return workspace.id === action.workspace.id ? action.workspace : workspace;
                }),
                isLoading: false
            };
        case 'RECEIVE_WORKSPACES':
            // Accept the incoming data if it matches the most recent request. For correct
            // handle out-of-order responses.
            if (action.startDateIndex === state.startDateIndex) {
                return {
                    startDateIndex: action.startDateIndex,
                    workspaces: action.workspaces,
                    isLoading: false
                };
            }
            break;
    }

    return state;
};
