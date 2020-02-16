import axios from 'axios';

interface IResolveFn<T> {
    (value?: T | PromiseLike<T>): void;
}

interface IRejectFn<T> {
    (reason?: any): void;
}

interface ICallbacks {
    onLoad?: Function;
    onError?: Function
}

declare const Keycloak: Function;

const loadPromise = new Promise<void>((resolve: IResolveFn<void>) => {
    document.addEventListener('DOMContentLoaded', (event) => {
        resolve();
    });
});

export const keycloakResolve = (): Promise<void> => {
    return new Promise<void>((resolve: IResolveFn<void>, reject: IRejectFn<void>) => {
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
                    const src = keycloakSettings['che.keycloak.js_adapter_url'];
                    const callbacks: ICallbacks = {};
                    callbacks.onLoad = () => {
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
                    callbacks.onError = reject;
                    addScript(src, callbacks);
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
            resolve();
        }).catch(error => {
            console.error(`Can't GET '/api'. ${error ? 'Error: ' : ''}`, error);
            reject();
        });
    });
};

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
                    config.headers['Authorization'] = `Bearer ${keycloak.token}`;
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

function addScript(src: string, callbacks: ICallbacks) {
    loadPromise.then(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = src;
        script.addEventListener('load', () => {
            if (callbacks.onLoad) {
                callbacks.onLoad();
            }
        });
        script.addEventListener('error', error => {
            console.log('error: ', error);
            if (callbacks.onError) {
                callbacks.onError(error);
            }
        });
        script.addEventListener('abort', () => {
            const error = 'Loader loading aborted.';
            console.log('error: ', error);
            if (callbacks.onError) {
                callbacks.onError(error);
            }
        });
        document.head.appendChild(script);
    })
}
