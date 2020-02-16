import * as React from 'react';
import * as ReactDOM from 'react-dom';
import axios from 'axios';
import {keycloakResolve} from './bootstrap/keycloak-setup';
import {CheBranding} from './bootstrap/che-branding';
import {App} from './components/App';
import {Loader} from './components/Loader'
import './styles/index.styl';

const ROOT = document.querySelector('.ui-container');

const cheBranding = CheBranding.get();
const loaderResolve = cheBranding.ready.then(() => {
    console.log(cheBranding.all);
    const src = cheBranding.getLoaderUrl();
    ReactDOM.render(<Loader src={src}/>, ROOT);
});

keycloakResolve().then(() => {
    cheBranding.ready.then(() => {
        loaderResolve.then(() => resumeBootstrap());
    });
});

function resumeBootstrap() {
    axios.get('/api/workspace').then(resp => {
        console.log(resp);
        ReactDOM.render(<App workspaces={resp.data}/>, ROOT);
    });
}
