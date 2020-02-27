import 'reflect-metadata';
import {Container} from 'inversify';
import {CheBranding} from './services/bootstrap/CheBranding';
import {KeycloakSetup} from './services/bootstrap/KeycloakSetup';
// import {Keycloak} from './services/keycloak/Keycloak';

const container = new Container();

container.bind(CheBranding).toSelf().inSingletonScope();
container.bind(KeycloakSetup).toSelf().inSingletonScope();
// container.bind(Keycloak).toSelf().inSingletonScope();

// const client = new Keycloak();
// container.bind<Client>("Client").toConstantValue(client);

export {container}
