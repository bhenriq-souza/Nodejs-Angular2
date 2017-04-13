import { Http, Response, Headers  } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Message } from "./message.model";
import 'rxjs/Rx';
import { Observable } from "rxjs";

@Injectable()
export class MessageService {
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http) { }

    addMessage(message: Message) {
        /* we need to translate the message received by the function into a JSON object, whose will be
           send in the request's body. */
        const _body = JSON.stringify(message);
        const _headers = new Headers({ 'Content-Type': 'application/json' });

        /* Here, we set up the post request to be sent to the server-side. However, it will not will be send in this line.
           In this line, we just call the http's post function, whose creates a observable. It doesn't send the post yet.
        */
        return this.http.post('http://localhost:3000/message', _body, { headers: _headers })
               .map( (response: Response) => {
                 const _result = response.json();
                 const _newMessage = new Message( _result.obj.content, 'Dummy', _result.obj._id, null );
                 this.messages.push(_newMessage);
                 return _newMessage;
               })  // the map() automatically converts the response into a observable
               .catch( (error: Response) => Observable.throw(error.json()));  // the catch() doesn't
    }

    getMessages() {
        return this.http.get('http://localhost:3000/message')
                   .map( (response: Response) => {
                     const messages = response.json().obj;
                     let transformedMessages: Message[] = [];
                     for (let message of messages) {
                       transformedMessages.push(new Message(message.content, 'Dummy', message._id, null));
                     }
                     this.messages = transformedMessages;
                     return transformedMessages;
                   })
                   .catch( (error: Response) => Observable.throw(error.json()));
    }

    loadMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message) {
      const _body = JSON.stringify(message);
      const _headers = new Headers({ 'Content-Type': 'application/json' });
      return this.http.patch('http://localhost:3000/message/' + message.messageId, _body, { headers: _headers })
             .map( (response: Response) => response.json() )
             .catch( (error: Response) => Observable.throw(error));
    }

    deleteMessage(message: Message) {
      this.messages.splice(this.messages.indexOf(message), 1);
      return this.http.delete('http://localhost:3000/message/' + message.messageId)
                 .map( (response: Response) => response.json() )
                 .catch( (error: Response) => Observable.throw(error));
    }
}
