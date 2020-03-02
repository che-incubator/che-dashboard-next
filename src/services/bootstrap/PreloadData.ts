import {container} from '../../inversify.config';
import {KeycloakSetup} from './KeycloakSetup';
import {CheBranding} from './CheBranding';
import {setBranding} from '../../store/Branding';
import {setUser} from '../../store/User';
import * as WorkspacesStore from '../../store/Workspaces';
import {Keycloak, IKeycloakUserInfo} from '../keycloak/Keycloak';
import * as $ from 'jquery';

/**
 * This class prepares all init data.
 * @author Oleksii Orel
 */
export class PreloadData {
    private cheBranding: CheBranding;
    private keycloakSetup: KeycloakSetup;
    private keycloak: Keycloak;
    private store: any;

    constructor(store: any) {
        this.store = store;
        this.cheBranding = container.get(CheBranding);
        this.keycloakSetup = container.get(KeycloakSetup);
        this.keycloak = container.get(Keycloak);
    }

    init(): void {
        this.setBranding();// default values for a loader
        this.updateBranding();
        this.updateUser().then(() => {
            this.updateKeycloakUserInfo();
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

    private updateKeycloakUserInfo(): void {
        if (!KeycloakSetup.keycloakAuth.isPresent) {
            return;
        }
        this.keycloak.fetchUserInfo().then((userInfo: IKeycloakUserInfo) => {
            const user = $.extend(this.keycloakSetup.getUser(), userInfo);
            this.store.dispatch(setUser({user}));
        });
    }
}
