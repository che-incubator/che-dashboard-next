import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {createStore} from 'redux';
import {allReduser} from './reducers';
import {Provider} from 'react-redux';

import {setBranding, setWorkspaces} from './actions';

import {keycloakResolve} from './bootstrap/keycloak-setup';
import {CheBranding} from './bootstrap/che-branding';
import fetchWorkspaces from './api/workspaces'

import App from './components/App';
import Loader from './components/Loader'

import './styles/index.styl';


const store = createStore(
    allReduser,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

const ROOT = document.querySelector('.ui-container');
const cheBranding = CheBranding.get();

store.dispatch(setBranding(cheBranding.all));
ReactDOM.render(<Provider store={store}><Loader/></Provider>, ROOT);

cheBranding.ready.then(() => {
    store.dispatch(setBranding(cheBranding.all));
});

keycloakResolve().then(() => {
    fetchWorkspaces().then(w => {
        store.dispatch(setWorkspaces(w));
    }).then(() => {
        ReactDOM.render(<Provider store={store}><App/></Provider>, ROOT);
    });
});
