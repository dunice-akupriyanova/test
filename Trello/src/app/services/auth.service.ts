import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {
  jwtHelper: JwtHelper = new JwtHelper();
  static tokens = JSON.parse(localStorage.getItem('tokens') ? localStorage.getItem('tokens') : '{}');
  private extractData(res: Response) {
    let body = res.json();
    return body;
  }
  private handleError(error: Response | any) {
    let errMsg: string;
    console.log(error);
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
  constructor(private http: Http) { }
  postForm(username: string, password: string, url: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, { username, password }, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  setTokens(tokens): void {
    AuthService.tokens = tokens;
    localStorage.setItem('tokens', JSON.stringify(tokens));
  }
  getTokens(): any {
    return AuthService.tokens;
  }
  refreshTokens(refreshToken): Observable<any> {
    let headers = new Headers({ 'Authorization': `${refreshToken}` });
    let options = new RequestOptions({ headers: headers });
    return this.http.get('http://localhost:3000/auth/refresh-token', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  logOut(): any {
    console.log('logOut');
    this.setTokens('');
    return this.http.get('http://localhost:3000/auth/logout')
      .map(this.extractData)
      .catch(this.handleError);
  }
  auth(accessToken): Observable<any> {
    let headers = new Headers({ 'Authorization': `JWT ${accessToken}` });
    let options = new RequestOptions({ headers: headers });
    // console.log('accessToken auth='+accessToken);
    return this.http.get('http://localhost:3000/auth/user', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}