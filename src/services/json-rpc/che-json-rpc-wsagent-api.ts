// import {CheJsonRpcApiClient, IChannel} from './che-json-rpc-api-service';
// import {ICommunicationClient} from './json-rpc-client';
//
// enum WsAgentChannels {
//   IMPORT_PROJECT
// }
//
// /**
//  * Client API for workspace agent interactions
//  */
// export class CheJsonRpcWsagentApi {
//   private cheJsonRpcApi: CheJsonRpcApiClient;
//   private channels: Map<WsAgentChannels, IChannel>;
//
//   constructor (client: ICommunicationClient) {
//     this.cheJsonRpcApi = new CheJsonRpcApiClient(client);
//
//     this.channels = new Map<WsAgentChannels, IChannel>();
//     this.channels.set(WsAgentChannels.IMPORT_PROJECT, {
//       subscription: 'importProject/subscribe',
//       unsubscription: 'importProject/unSubscribe',
//       notification: 'importProject/progress/'
//     });
//   }
//
//   /**
//    * Connect pointed entrypoint with provided client's id
//    */
//   connect(entrypoint: string, clientId: string): Promise<any> {
//     let clientParam = 'clientId=' + clientId;
//     if (/\?/.test(entrypoint)) {
//       clientParam = '&' + clientParam;
//     } else {
//       clientParam = '?' + clientParam;
//     }
//     return this.cheJsonRpcApi.connect(entrypoint + clientParam);
//   }
//
//   /**
//    * Subscribes on project's import output
//    */
//   subscribeProjectImport(projectName: string, callback: Function): void {
//     const channel = this.channels.get(WsAgentChannels.IMPORT_PROJECT);
//     if (!channel) {
//       return;
//     }
//     this.cheJsonRpcApi.subscribe(channel.subscription, channel.notification + projectName, callback);
//   }
//
//   /**
//    * Un-subscribes the pointed callback from projects's import output
//    */
//   unSubscribeProjectImport(projectName: string, callback: Function): void {
//     const channel = this.channels.get(WsAgentChannels.IMPORT_PROJECT);
//     if (!channel) {
//       return;
//     }
//     this.cheJsonRpcApi.unsubscribe(channel.unsubscription, channel.notification + projectName, callback);
//   }
// }
