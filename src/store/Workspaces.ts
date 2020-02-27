import {Action, Reducer} from 'redux';
import {AppThunkAction} from './';
import fetchWorkspaces from '../services/api/workspaces';

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

type KnownAction = RequestWorkspacesAction | ReceiveWorkspacesAction;

// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    // TODO finish with 'startDateIndex' implementation
    requestWorkspaces: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.workspaces && startDateIndex !== appState.workspaces.startDateIndex) {
            fetchWorkspaces()
                .then(data => {
                    dispatch({type: 'RECEIVE_WORKSPACES', startDateIndex: startDateIndex, workspaces: data});
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
