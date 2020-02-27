// import {IDeferred, getDeferred} from '../deferred';
//
// const JSON_RPC_VERSION = '2.0';
//
// export type communicationClientEvent = 'open' | 'response' | 'close' | 'error';
//
// /**
//  * Interface for communication between two entrypoints
//  */
// export interface ICommunicationClient {
//     /**
//      * Performs connections
//      */
//     connect(entrypoint: string): Promise<any>;
//
//     /**
//      * Close the connection
//      */
//     disconnect(): void;
//
//     /**
//      * Adds listener on client event
//      */
//     addListener(event: communicationClientEvent, handler: Function): void;
//
//     /**
//      * Removes listener
//      */
//     removeListener(event: communicationClientEvent, handler: Function): void;
//
//     /**
//      * Send pointed data
//      */
//     send(data: any): void;
// }
//
// type IRequest = {
//     jsonrpc: string,
//     id: string,
//     method: string,
//     params: any,
// }
//
// type IResponse = {
//     jsonrpc: string,
//     id: string,
//     result?: any,
//     error?: IError,
// }
//
// type INotification = {
//     jsonrpc: string,
//     method: string,
//     params: any,
// }
//
// type IError = {
//     number: number,
//     message: string,
//     data?: any,
// }
//
// /**
//  * This client is handling the JSON RPC requests
//  */
// export class JsonRpcClient {
//     /**
//      * Client for performing communications
//      */
//     private client: ICommunicationClient;
//     /**
//      * The list of the pending requests by request id
//      */
//     private pendingRequests: Map<string, IDeferred<any>>;
//     /**
//      * The list of notification handlers by method name
//      */
//     private notificationHandlers: Map<string, Array<Function>>;
//     private counter = 5;
//
//     constructor(client: ICommunicationClient) {
//         this.client = client;
//         this.pendingRequests = new Map<string, IDeferred<any>>();
//         this.notificationHandlers = new Map<string, Array<Function>>();
//
//         this.client.addListener('response', (message: any) => {
//             this.processResponse(message);
//         });
//     }
//
//     /**
//      * Performs JSON RPC request
//      */
//     request(method: string, params?: any): Promise<any> {
//         const deferred = getDeferred();
//         const id = `${this.counter++}`;
//         this.pendingRequests.set(id, deferred);
//         const request: IRequest = {
//             jsonrpc: JSON_RPC_VERSION,
//             id: id,
//             method: method,
//             params: params
//         };
//         this.client.send(request);
//
//         return deferred.promise;
//     }
//
//     /**
//      * Sends JSON RPC notification
//      */
//     notify(method: string, params?: any): void {
//         const request: INotification = {
//             jsonrpc: JSON_RPC_VERSION,
//             method: method,
//             params: params
//         };
//         this.client.send(request);
//     }
//
//     /**
//      * Adds notification handler
//      */
//     public addNotificationHandler(method: string, handler: Function): void {
//         const handlers = this.notificationHandlers.get(method);
//         if (handlers) {
//             handlers.push(handler);
//             return;
//         }
//         this.notificationHandlers.set(method, [handler]);
//     }
//
//     /**
//      * Removes notification handler
//      */
//     public removeNotificationHandler(method: string, handler: Function): void {
//         let handlers = this.notificationHandlers.get(method);
//
//         if (handlers && handler) {
//             handlers.splice(handlers.indexOf(handler), 1);
//         }
//     }
//
//     /**
//      * Processes response - detects whether it is JSON RPC response or notification
//      */
//     private processResponse(message: any): void {
//         if (message.id && this.pendingRequests.has(message.id)) {
//             this.processResponseMessage(message);
//             return;
//         }
//         this.processNotification(message);
//     }
//
//     /**
//      * Processes JSON RPC notification
//      */
//     private processNotification(message: any): void {
//         const method = message.method;
//         const handlers = this.notificationHandlers.get(method);
//         if (handlers && handlers.length > 0) {
//             handlers.forEach((handler: Function) => {
//                 handler(message.params);
//             });
//         }
//     }
//
//     /**
//      * Process JSON RPC response
//      */
//     private processResponseMessage(message: any): void {
//         let promise = this.pendingRequests.get(message.id);
//         if (!promise) {
//             return;
//         }
//         if (message.result) {
//             promise.resolve(message.result);
//             return;
//         }
//         promise.reject(message.error);
//     }
// }
