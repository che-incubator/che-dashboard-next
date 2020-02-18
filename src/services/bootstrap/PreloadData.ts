import {container} from '../../inversify.config';
import {KeycloakSetup} from './KeycloakSetup';
import {setBranding} from '../../store/Branding';
import {CheBranding} from './CheBranding';
import {setUser} from '../../store/User';

export class PreloadData {
    private cheBranding: CheBranding;
    private keycloakSetup: KeycloakSetup;
    private store: any;

    constructor(store: any) {
        this.store = store;
        this.cheBranding = container.get(CheBranding);
        this.keycloakSetup = container.get(KeycloakSetup);
    }

    init(): void {
        this.setBranding();
        this.updateUser();
        this.updateBranding();
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

    private updateUser() {
        this.keycloakSetup.resolve().then(() => {
            this.setUser();
        });
    }
}
