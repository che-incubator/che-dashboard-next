import 'reflect-metadata';
import {Container} from 'inversify';
import {CheBranding} from './services/bootstrap/CheBranding';
import {KeycloakSetup} from './services/bootstrap/KeycloakSetup';
import {Keycloak} from './services/keycloak/Keycloak';
import {WebsocketClient} from './services/json-rpc/websocket-client';
import {CheJsonRpcApi} from "./services/json-rpc/che-json-rpc-api.factory";

const container = new Container();

container.bind(CheBranding).toSelf().inSingletonScope();
container.bind(KeycloakSetup).toSelf().inSingletonScope();
container.bind(Keycloak).toSelf().inSingletonScope();
container.bind(CheJsonRpcApi).toSelf().inSingletonScope();

container.bind(WebsocketClient).toSelf();

export {container}
