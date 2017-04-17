import { Http, Response, Headers  } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { ErrorService } from "../errors/error.service";
import { Message } from "./message.model";


@Injectable()
export class MessageService {
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http, private errorService: ErrorService) { }

    addMessage(message: Message) {
        /* we need to translate the message received by the function into a JSON object, whose will be
           send in the request's body. */
        const _body = JSON.stringify(message);
        const _headers = new Headers({ 'Content-Type': 'application/json' });
        const _token = localStorage.getItem('token')
                       ? '?token=' + localStorage.getItem('token')
                       : '';

        /* Here, we set up the post request to be sent to the server-side. However, it will not will be send in this line.
           In this line, we just call the http's post function, whose creates a observable. It doesn't send the post yet.
        */
        return this.http.post('http://localhost:3000/message' + _token, _body, { headers: _headers })
               .map( (response: Response) => {
                 const _result = response.json();
                 const _newMessage = new Message(
                   _result.obj.content,
                   _result.obj.user.firstName,
                   _result.obj._id,
                   _result.obj.user._id
                 );
                 this.messages.push(_newMessage)
                 return _newMessage;
               })  // the map() automatically converts the response into a observable
               .catch( (error: Response) => {
                 this.errorService.handleError(error.json());
                 return Observable.throw(error.json());
               });  // the catch() doesn't
    }

    getMessages() {
        return this.http.get('http://localhost:3000/message')
                   .map( (response: Response) => {
                     const messages = response.json().obj;
                     let transformedMessages: Message[] = [];
                     for (let message of messages) {
                       transformedMessages.push(
                         new Message(message.content,
                                     message.user.firstName,
                                     message._id,
                                     message.user._id)
                       );
                     }
                     this.messages = transformedMessages;
                     return transformedMessages;
                   })
                   .catch( (error: Response) => {
                     this.errorService.handleError(error.json());
                     return Observable.throw(error.json());
                   });
    }

    loadMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message) {
      const _body = JSON.stringify(message);
      const _headers = new Headers({ 'Content-Type': 'application/json' });
      const _token = localStorage.getItem('token')
                     ? '?token=' + localStorage.getItem('token')
                     : '';
      return this.http.patch('http://localhost:3000/message/' + message.messageId + _token, _body, { headers: _headers })
             .map( (response: Response) => response.json() )
             .catch( (error: Response) => {
               this.errorService.handleError(error.json());
               return Observable.throw(error.json());
             });
    }

    deleteMessage(message: Message) {
      this.messages.splice(this.messages.indexOf(message), 1);
      const _token = localStorage.getItem('token')
                     ? '?token=' + localStorage.getItem('token')
                     : '';
      return this.http.delete('http://localhost:3000/message/' + message.messageId + _token)
                 .map( (response: Response) => response.json() )
                 .catch( (error: Response) => {
                   this.errorService.handleError(error.json());
                   return Observable.throw(error.json());
                 });
    }
}
