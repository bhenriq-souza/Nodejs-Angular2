import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from 'rxjs';
import { User } from "./user.model";

@Injectable()
export class AuthService{
  constructor(private http: Http) { }

  signup(user: User) {
    const _body = JSON.stringify(user);
    const _header = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post('http://localhost:3000/user', _body, { headers: _header } )
               .map( (response: Response) => response.json() )
               .catch( (error: Response) => Observable.throw(error.json()));
  }

  signin(user: User) {
    const _body = JSON.stringify(user);
    const _header = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post('http://localhost:3000/user/signin', _body, { headers: _header } )
               .map( (response: Response) => response.json() )
               .catch( (error: Response) => Observable.throw(error.json()));
  }

  logout() {
    localStorage.clear();
  }

  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }
}
