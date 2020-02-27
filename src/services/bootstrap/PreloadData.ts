import {container} from '../../inversify.config';
import {KeycloakSetup} from './KeycloakSetup';
import {CheBranding} from './CheBranding';
import {setBranding} from '../../store/Branding';
import {setUser} from '../../store/User';
import * as WorkspacesStore from '../../store/Workspaces';
// import {Keycloak} from '../keycloak/Keycloak';

export class PreloadData {
    private cheBranding: CheBranding;
    private keycloakSetup: KeycloakSetup;
//    private keycloak: Keycloak;
    private store: any;

    constructor(store: any) {
        this.store = store;
        this.cheBranding = container.get(CheBranding);
        this.keycloakSetup = container.get(KeycloakSetup);
//        this.keycloak = container.get(Keycloak);
    }

    init(): void {
        this.setBranding();// default values for a loader
        this.updateBranding();
        this.updateUser().then(() => {
            this.keycloakSetup.fetchUserInfo().then((info: any) => {
               console.log('>>>>>>>>>>>>>>>>>>>>>>>> user info:', info);
            });
            this.updateWorkspaces();
        });

    }

    private setBranding(): void {
        const branding = this.cheBranding.all;
        this.store.dispatch(setBranding({branding}));
    }

    private updateBranding(): void {
        this.cheBranding.ready.then(() => {
            this.setBranding();
        });
    }

    private setUser(): void {
        const user = this.keycloakSetup.getUser();
        this.store.dispatch(setUser({user}));
    }

    private updateUser(): Promise<void> {
        return this.keycloakSetup.resolve().then(() => {
            this.setUser();
        });
    }

    private updateWorkspaces(): void {
        const requestWorkspaces = WorkspacesStore.actionCreators.requestWorkspaces;
        requestWorkspaces(0)(this.store.dispatch, () => ({workspaces: {workspaces: []}} as any));
    }
}
