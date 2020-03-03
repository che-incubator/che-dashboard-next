import {CheJsonRpcMasterApi} from './che-json-rpc-master-api';
import {injectable} from "inversify";
// import {WebsocketClient} from './websocket-client';
// import {CheJsonRpcWsagentApi} from './che-json-rpc-wsagent-api';
// import {CheKeycloak} from '../che-keycloak.factory';

/**
 * This class manages the api connection through JSON RPC.
 */
@injectable()
export class CheJsonRpcApi {
  private jsonRpcApiConnection: Map<string, CheJsonRpcMasterApi>;
  // private cheKeycloak: CheKeycloak;

  /**
   * Default constructor that is using resource.
   */
  constructor() {
    this.jsonRpcApiConnection = new Map<string, CheJsonRpcMasterApi>();
  }

  getJsonRpcMasterApi(entrypoint: string): CheJsonRpcMasterApi {
    if (this.jsonRpcApiConnection.has(entrypoint)) {
      return <CheJsonRpcMasterApi>this.jsonRpcApiConnection.get(entrypoint);
    } else {
      // const websocketClient = new WebsocketClient(this.$websocket, this.$q);
      const cheJsonRpcMasterApi: CheJsonRpcMasterApi = new CheJsonRpcMasterApi(entrypoint);
      this.jsonRpcApiConnection.set(entrypoint, cheJsonRpcMasterApi);
      return cheJsonRpcMasterApi;
    }
  }

  // getJsonRpcWsagentApi(entrypoint: string): CheJsonRpcWsagentApi {
  //   let websocketClient = new WebsocketClient(this.$websocket, this.$q);
  //   let cheJsonRpcWsagentApi: CheJsonRpcWsagentApi = new CheJsonRpcWsagentApi(websocketClient);
  //   return cheJsonRpcWsagentApi;
  // }

}
