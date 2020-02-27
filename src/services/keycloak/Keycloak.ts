// import {inject, injectable} from 'inversify';
// import {getDeferred, IDeferred} from '../deferred';
// import {KeycloakSetup} from '../bootstrap/KeycloakSetup';
//
// export type keycloakUserInfo = {
//     email: string;
//     family_name: string;
//     given_name: string;
//     name: string;
//     preferred_username: string;
//     sub: string;
// };
//
// /**
//  * This class is handling interactions with Keycloak
//  */
//
// export class Keycloak {
//     keycloak: any;
//     keycloakConfig: any;
//
//     // @inject(KeycloakSetup)
//     // protected readonly keycloakSetup: KeycloakSetup;
//
//
//     fetchUserInfo(): Promise<keycloakUserInfo> {
//         const defer: IDeferred<keycloakUserInfo> = getDeferred();
//
//         console.log('>>>> step 0 >>>>>>');
//         this.keycloakSetup.resolve().then( () => {
//             console.log('>>>> step 1 >>>>>>');
//             const keycloakAuth = this.keycloakSetup.getKeycloakAuth();
//             console.log('>>>> step 3 >>>>>>');
//             if (keycloakAuth && keycloakAuth.keycloak) {
//                 this.keycloak = keycloakAuth.keycloak;
//                 this.keycloakConfig = keycloakAuth.config;
//                 this.keycloak.loadUserInfo().success((userInfo: keycloakUserInfo) => {
//                     console.log('>>>> step 4 >>>>>>', userInfo);
//                     defer.resolve(userInfo);
//                 }).error((error: any) => {
//                     defer.reject(`User info fetching failed, error: ${error}`);
//                 });
//             } else {
//                 defer.reject('Keycloak is not found on the page.');
//             }
//         });
//
//         return defer.promise;
//     }
//
//     updateToken(validityTime: number): Promise<boolean> {
//         const deferred: IDeferred<boolean> = getDeferred();
//
//         this.keycloak.updateToken(validityTime).success((refreshed: boolean) => {
//             deferred.resolve(refreshed);
//         }).error((error: any) => {
//             deferred.reject(error);
//         });
//
//         return deferred.promise;
//     }
//
//     isPresent(): boolean {
//         return this.keycloak !== null;
//     }
//
//     getProfileUrl(): string {
//         return this.keycloak.createAccountUrl();
//     }
//
//     logout(): void {
//         window.sessionStorage.removeItem('githubToken');
//         window.sessionStorage.setItem('oidcDashboardRedirectUrl', location.href);
//         this.keycloak.logout({});
//     }
//
//}
