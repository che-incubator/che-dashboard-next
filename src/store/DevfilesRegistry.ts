import {Action, Reducer} from 'redux';
import {AppThunkAction} from './';
import fetchDevfiles from '../services/api/devfiles-registry';

// This state defines the type of data maintained in the Redux store.
export interface DevfilesState {
    isLoading: boolean;
    startDateIndex?: number;
    data: { devfiles: che.IDevfileMetaData[]; registryUrl: string }[];
}

interface RequestDevfilesAction {
    type: 'REQUEST_DEVFILES';
    startDateIndex: number;
}

interface ReceiveDevfilesAction {
    type: 'RECEIVE_DEVFILES';
    startDateIndex: number;
    data: { devfiles: che.IDevfileMetaData[]; registryUrl: string }[];
}

type KnownAction = RequestDevfilesAction | ReceiveDevfilesAction;


// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    // TODO finish with 'startDateIndex' implementation
    requestDevfiles: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.devfilesRegistry && startDateIndex !== appState.devfilesRegistry.startDateIndex) {
            fetchDevfiles()
                .then(res => {
                    dispatch({type: 'RECEIVE_DEVFILES', startDateIndex: startDateIndex, data: [res]});
                });
            dispatch({type: 'REQUEST_DEVFILES', startDateIndex: startDateIndex});
        }
    }
};

const unloadedState: DevfilesState = {data: [], isLoading: false, startDateIndex: 0};

export const reducer: Reducer<DevfilesState> = (state: DevfilesState | undefined, incomingAction: Action): DevfilesState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_DEVFILES':
            return {
                startDateIndex: action.startDateIndex,
                data: state.data,
                isLoading: true
            };
        case 'RECEIVE_DEVFILES':
            // Accept the incoming data if it matches the most recent request. For correct
            // handle out-of-order responses.
            if (action.startDateIndex === state.startDateIndex) {
                return {
                    startDateIndex: action.startDateIndex,
                    data: action.data,
                    isLoading: false
                };
            }
            break;
    }

    return state;
};
