import {
    BRANDING_DEFAULT,
    IBrandingConfiguration,
    IBrandingDocs,
    IBrandingFooter,
    IBrandingWorkspace
} from './branding.constant'

interface IResolveFn<T> {
    (value?: T | PromiseLike<T>): void;
}

interface IRejectFn<T> {
    (reason?: any): void;
}

export type IBranding = { [key: string]: string | Object };

const BRANDING_SERVICE_SYMBOL = Symbol('CheBranding');
const ASSET_PREFIX = 'dashboard/assets/branding/';

/**
 * This class is handling the branding data.
 * @author Oleksii Orel
 */
export class CheBranding {
    private branding = BRANDING_DEFAULT;
    private readonly readyPromise: Promise<void>;

    static get(): CheBranding {
        const global = window as any; // tslint:disable-line
        return global[BRANDING_SERVICE_SYMBOL] || new CheBranding();
    }

    protected constructor() {
        const global = window as any; // tslint:disable-line
        global[BRANDING_SERVICE_SYMBOL] = this;

        this.readyPromise = this.updateData();
    }

    get ready(): Promise<void> {
        return this.readyPromise;
    }

    /**
     * Update branding data.
     */
    private updateData(): Promise<void> {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${ASSET_PREFIX}product.json`);
        return new Promise<void>((resolve: IResolveFn<void>, reject: IRejectFn<void>) => {
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status === 200) {
                    resolve();
                } else {
                    const error = xhr.responseText ? xhr.responseText : 'Unknown error';
                    console.error(`Can't GET "${ASSET_PREFIX}product.json". Error: `, error);
                    reject(error);
                }
            };
        });
    }

    get all(): IBranding {
        return {
            title: this.getProductName(),
            name: this.getName(),
            logoURL: this.getProductLogo(),
            logoText: this.getProductLogoText(),
            favicon: this.getProductFavicon(),
            loaderURL: this.getLoaderUrl(),
            websocketContext: this.getWebsocketContext(),
            helpPath: this.getProductHelpPath(),
            helpTitle: this.getProductHelpTitle(),
            footer: this.getFooter(),
            supportEmail: this.getProductSupportEmail(),
            oauthDocs: this.getOauthDocs(),
            cli: this.getCLI(),
            docs: this.getDocs(),
            workspace: this.getWorkspace(),
            configuration: this.getConfiguration(),
        };
    }

    /**
     * Gets name.
     */
    getName(): string {
        return this.branding.name;
    }

    /**
     * Gets product name.
     */
    getProductName(): string {
        return this.branding.title;
    }

    /**
     * Gets product logo.
     */
    getProductLogo(): string {
        return ASSET_PREFIX + this.branding.logoFile;
    }

    /**
     * Gets product favicon.
     */
    getProductFavicon(): string {
        return ASSET_PREFIX + this.branding.favicon;
    }

    /**
     * Gets product loader.
     */
    getLoaderUrl(): string {
        return ASSET_PREFIX + this.branding.loader;
    }

    /**
     * Gets ide resources path.
     */
    getWebsocketContext(): string {
        return this.branding.websocketContext;
    }

    /**
     * Gets product help path.
     */
    getProductHelpPath(): string {
        return this.branding.helpPath;
    }

    /**
     * Gets product help title.
     */
    getProductHelpTitle(): string {
        return this.branding.helpTitle;
    }

    /**
     * Gets product logo text.
     */
    getProductLogoText(): string {
        return ASSET_PREFIX + this.branding.logoTextFile;
    }

    /**
     * Gets oauth docs.
     */
    getOauthDocs(): string {
        return this.branding.oauthDocs;
    }

    /**
     * Gets product support email.
     */
    getProductSupportEmail(): string {
        return this.branding.supportEmail;
    }

    /**
     * Returns footer additional elements (email button, content, button links).
     */
    getFooter(): IBrandingFooter {
        return this.branding.footer;
    }

    /**
     * Returns object with configName and name.
     */
    getCLI(): { configName: string; name: string } {
        return this.branding.cli;
    }

    /**
     * Returns object with docs URLs.
     */
    getDocs(): IBrandingDocs {
        return this.branding.docs;
    }

    /**
     * Returns object with workspace dedicated data.
     */
    getWorkspace(): IBrandingWorkspace {
        return this.branding.workspace;
    }

    /**
     * Returns object with UD configuration options.
     */
    getConfiguration(): IBrandingConfiguration {
        return this.branding.configuration;
    }
}
