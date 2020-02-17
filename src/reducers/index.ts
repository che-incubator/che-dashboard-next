import workspacesReducer from './workspaces';
import brandingReducer from './branding';
import {combineReducers} from 'redux';

export const allReduser = combineReducers({
    workspaces: workspacesReducer,
    branding: brandingReducer
});
