// import {CheJsonRpcMasterApi} from './che-json-rpc-master-api';
// import {WebsocketClient} from './websocket-client';
// import {CheJsonRpcWsagentApi} from './che-json-rpc-wsagent-api';
// import {CheKeycloak} from '../che-keycloak.factory';
//
// /**
//  * This class manages the api connection through JSON RPC
//  */
// export class CheJsonRpcApi {
//
//   static $inject = ['$q', '$websocket', '$log', '$timeout', '$interval', 'cheKeycloak'];
//
//   private $q: ng.IQService;
//   private $websocket: any;
//   private $log: ng.ILogService;
//   private jsonRpcApiConnection: Map<string, CheJsonRpcMasterApi>;
//   private $timeout: ng.ITimeoutService;
//   private $interval: ng.IIntervalService;
//   private cheKeycloak: CheKeycloak;
//
//   /**
//    * Default constructor that is using resource
//    */
//   constructor(
//     $q: ng.IQService,
//     $websocket: any,
//     $log: ng.ILogService,
//     $timeout: ng.ITimeoutService,
//     $interval: ng.IIntervalService,
//     cheKeycloak: CheKeycloak
//   ) {
//     this.$q = $q;
//     this.$websocket = $websocket;
//     this.$log = $log;
//     this.$timeout = $timeout;
//     this.$interval = $interval;
//     this.jsonRpcApiConnection = new Map<string, CheJsonRpcMasterApi>();
//     this.cheKeycloak = cheKeycloak;
//   }
//
//   getJsonRpcMasterApi(entrypoint: string): CheJsonRpcMasterApi {
//     if (this.jsonRpcApiConnection.has(entrypoint)) {
//       return this.jsonRpcApiConnection.get(entrypoint);
//     } else {
//       const websocketClient = new WebsocketClient(this.$websocket, this.$q);
//       const cheJsonRpcMasterApi: CheJsonRpcMasterApi = new CheJsonRpcMasterApi(websocketClient, entrypoint, this.$log, this.$timeout, this.$interval, this.$q, this.cheKeycloak);
//       this.jsonRpcApiConnection.set(entrypoint, cheJsonRpcMasterApi);
//       return cheJsonRpcMasterApi;
//     }
//   }
//
//   getJsonRpcWsagentApi(entrypoint: string): CheJsonRpcWsagentApi {
//     let websocketClient = new WebsocketClient(this.$websocket, this.$q);
//     let cheJsonRpcWsagentApi: CheJsonRpcWsagentApi = new CheJsonRpcWsagentApi(websocketClient);
//     return cheJsonRpcWsagentApi;
//   }
//
// }
