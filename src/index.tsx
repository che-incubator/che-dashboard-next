import * as React from "react";
import * as ReactDOM from "react-dom";
import axios from "axios";

import {App} from "./components/App";
import {Script} from "./components/Script";

interface IResolveFn<T> {
    (value?: T | PromiseLike<T>): void;
}

interface IRejectFn<T> {
    (reason?: any): void;
}

declare const Keycloak: Function;

const ROOT = document.querySelector(".container");

function resumeBootstrap() {
    axios.get('/api/workspace').then(resp => {
        console.log(resp);
        ReactDOM.render(<App workspaces={resp.data}/>, ROOT);
    });
}

axios.get('/api/keycloak/settings')
    .then(resp => {
        const keycloakAuth: { [prop: string]: any } = {
            isPresent: false,
            keycloak: null,
            config: null
        };
        const keycloakSettings = resp.data;
        keycloakAuth.config = buildKeycloakConfig(keycloakSettings);
        return new Promise((resolve: IResolveFn<any>, reject: IRejectFn<any>) => {
            const onLoad = () => {
                let theUseNonce = false;
                if (typeof keycloakSettings['che.keycloak.use_nonce'] === 'string') {
                    theUseNonce = keycloakSettings['che.keycloak.use_nonce'].toLowerCase() === 'true';
                }
                const initOptions = {
                    useNonce: theUseNonce,
                    redirectUrl: keycloakSettings['che.keycloak.redirect_url.dashboard']
                };
                keycloakInit(keycloakAuth.config, initOptions).then(keycloak => {
                    resolve(keycloak);
                }).catch(error => {
                    reject(error);
                });
            };
            const url = keycloakSettings['che.keycloak.js_adapter_url'];
            ReactDOM.render(<Script onLoad={onLoad} onError={reject} src={`${url}`}/>, document.head);
        }).then((keycloak: any) => {
            keycloakAuth.isPresent = true;
            keycloakAuth.keycloak = keycloak;
            (window as any)['_keycloak'] = keycloak;
        });
    }).catch(error => {
    console.log(error);
}).then(() => {
    const keycloak = (window as any)._keycloak;
    return getApis(keycloak);
}).then(() => {
    resumeBootstrap();
}).catch(error => {
    console.error(`Can't GET "/api". ${error ? 'Error: ' : ''}`, error);
});

function buildKeycloakConfig(keycloakSettings: any): any {
    const theOidcProvider = keycloakSettings['che.keycloak.oidc_provider'];
    if (!theOidcProvider) {
        return {
            url: keycloakSettings['che.keycloak.auth_server_url'],
            realm: keycloakSettings['che.keycloak.realm'],
            clientId: keycloakSettings['che.keycloak.client_id']
        };
    } else {
        return {
            oidcProvider: theOidcProvider,
            clientId: keycloakSettings['che.keycloak.client_id']
        };
    }
}

function keycloakInit(keycloakConfig: any, initOptions: any): Promise<any> {
    return new Promise((resolve: IResolveFn<any>, reject: IRejectFn<any>) => {
        if (!Keycloak) {
            reject('No Keycloak');
        }
        const keycloak = Keycloak(keycloakConfig);
        window.sessionStorage.setItem('oidcDashboardRedirectUrl', location.href);
        keycloak.init({
            onLoad: 'login-required',
            checkLoginIframe: false,
            useNonce: initOptions['useNonce'],
            scope: 'email profile',
            redirectUri: initOptions['redirectUrl']
        }).success(() => {
            resolve(keycloak);
        }).error((error: any) => {
            reject(error);
        });
    });
}

function getApis(keycloak: any): Promise<void> {
    return setAuthorizationHeader(keycloak).then(() => {
        return new Promise<void>((resolve: IResolveFn<void>, reject: IRejectFn<void>) => {
            axios.get('/api/')
                .then(resp => {
                    if (resp.data) {
                        resolve();
                    } else {
                        reject('Unknown error');
                    }
                }).catch(error => {
                console.log(error);
            });
        });
    });
}

function setAuthorizationHeader(keycloak: any): Promise<void> {
    return new Promise((resolve: IResolveFn<any>, reject: IRejectFn<any>) => {
        if (keycloak && keycloak.token) {
            keycloak.updateToken(5).success(() => {
                axios.interceptors.request.use(config => {
                    config.headers["Authorization"] = `Bearer ${keycloak.token}`;
                    return config;
                });
                resolve();
            }).error(() => {
                console.log('Failed to refresh token');
                window.sessionStorage.setItem('oidcDashboardRedirectUrl', location.href);
                keycloak.login();
                reject('Authorization is needed.');
            });
        }
        resolve();
    });
}
