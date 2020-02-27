// import {ICommunicationClient, JsonRpcClient} from './json-rpc-client';
//
// export class IChannel {
//   subscription: string;
//   unsubscription: string;
//   notification: string;
// }
//
// /**
//  * Class for basic CHE API communication methods
//  */
// export class CheJsonRpcApiClient {
//   /**
//    * Client that implements JSON RPC protocol.
//    */
//   private jsonRpcClient: JsonRpcClient;
//   /**
//    * Communication client (can be http, websocket).
//    */
//   private client: ICommunicationClient;
//
//   constructor (client: ICommunicationClient) {
//     this.client = client;
//     this.jsonRpcClient = new JsonRpcClient(client);
//   }
//
//   /**
//    * Subscribe on the events from service
//    */
//   subscribe(event: string, notification: string, handler: Function, params?: any): void {
//     this.jsonRpcClient.addNotificationHandler(notification, handler);
//     this.jsonRpcClient.notify(event, params);
//   }
//
//   /**
//    * Unsubscribe concrete handler from events from service
//    */
//   unsubscribe(event: string, notification: string, handler: Function, params?: any): void {
//     this.jsonRpcClient.removeNotificationHandler(notification, handler);
//     this.jsonRpcClient.notify(event);
//   }
//
//   /**
//    * Connects to the pointed entrypoint
//    */
//   connect(entrypoint: string): ng.IPromise<any> {
//     return this.client.connect(entrypoint);
//   }
//
//   /**
//    * Makes request
//    */
//   request(method: string, params?: any): ng.IPromise<any> {
//     return this.jsonRpcClient.request(method, params);
//   }
// }
