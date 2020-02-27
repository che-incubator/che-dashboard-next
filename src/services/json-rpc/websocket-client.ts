// import {communicationClientEvent, ICommunicationClient} from './json-rpc-client';
//
//
// /**
//  * JSON RPC through websocket.
//  */
// export class WebsocketClient implements ICommunicationClient {
//   onResponse: Function;
//   private $websocket: any = {};
//   private websocketStream: any = {};
//
//   private handlers: {[event: string]: Function[]};
//
//   constructor () {
//     // this.$websocket = $websocket;
//
//     this.handlers = {};
//   }
//
//   /**
//    * Performs connection to the pointed entrypoint
//    */
//   connect(entrypoint: string): Promise<any> {
//     let deferred = this.$q.defer();
//     this.websocketStream = this.$websocket(entrypoint);
//
//     this.websocketStream.onOpen(() => {
//       const event: communicationClientEvent = 'open';
//       if (this.handlers[event] && this.handlers[event].length > 0) {
//         this.handlers[event].forEach((handler: Function) => handler() );
//       }
//
//       deferred.resolve();
//     });
//     this.websocketStream.onError(() => {
//       const event: communicationClientEvent = 'error';
//       if (!this.handlers[event] || this.handlers[event].length === 0) {
//         return;
//       }
//
//       this.handlers[event].forEach((handler: Function) => handler() );
//
//       deferred.reject();
//     });
//     this.websocketStream.onMessage((message: any) => {
//       const data = JSON.parse(message.data);
//
//       const event: communicationClientEvent = 'response';
//       if (!this.handlers[event] || this.handlers[event].length === 0) {
//         return;
//       }
//
//       this.handlers[event].forEach((handler: Function) => handler(data) );
//     });
//     this.websocketStream.onClose(() => {
//       const event: communicationClientEvent = 'close';
//       if (!this.handlers[event] || this.handlers[event].length === 0) {
//         return;
//       }
//
//       this.handlers[event].forEach((handler: Function) => handler() );
//     });
//
//     return deferred.promise;
//   }
//
//   /**
//    * Performs closing the connection
//    */
//   disconnect(): void {
//     if (this.websocketStream) {
//       this.websocketStream.close();
//     }
//   }
//
//   /**
//    * Adds a listener on an event
//    */
//   addListener(event: communicationClientEvent, handler: Function): void {
//     if (!this.handlers[event]) {
//       this.handlers[event] = [];
//     }
//     this.handlers[event].push(handler);
//   }
//
//   /**
//    * Removes a listener
//    */
//   removeListener(event: communicationClientEvent, handler: Function): void {
//     if (this.handlers[event] && handler) {
//       const index = this.handlers[event].indexOf(handler);
//       if (index !== -1) {
//         this.handlers[event].splice(index, 1);
//       }
//     }
//   }
//
//   /**
//    * Sends pointed data
//    */
//   send(data: any): void {
//     if (this.websocketStream) {
//       this.websocketStream.send(data);
//     } else {
//       console.log(`Failed to send data. WebSocket stream isn't open.`);
//     }
//   }
// }
