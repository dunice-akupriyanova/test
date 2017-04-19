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
  static JwtHelper: JwtHelper = new JwtHelper();
  static tokens = JSON.parse(localStorage.getItem('tokens') ? localStorage.getItem('tokens') : '{}');
  private extractData(res: Response) {
    let body = res.json();
    return body;
  }
  private extractData2(res: Response) {
    let body = res.json();
    AuthService.SetTokens(body);
    return body;
  }
  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      errMsg = `${error.status} - ${error.statusText || ''} ${error}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
  constructor(private http: Http) { }
  static HTTP: Http;
  postForm(username: string, password: string, url: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, { username, password }, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  setTokens(tokens): void {
    console.log('setTokens');
    AuthService.tokens = tokens;
    localStorage.setItem('tokens', JSON.stringify(tokens));
  }
  static SetTokens(tokens): void {
    console.log('SetTokens');
    AuthService.tokens = tokens;
    localStorage.setItem('tokens', JSON.stringify(tokens));
  }
  getTokens(): any {
    return AuthService.tokens;
  }
  refreshTokens(refreshToken): Observable<any> {
    console.log('refreshTokens');
    let headers = new Headers({ 'Authorization': `${refreshToken}` });
    let options = new RequestOptions({ headers: headers });
    // return this.http.get('http://localhost:3000/auth/refresh-token', options)
    //   .map(this.extractData)
    //   .catch(this.handleError);
    return this.http.get('http://localhost:3000/auth/refresh-token', options)
      .map(this.extractData2)
      .catch(this.handleError);
  }

  static ExtractData2(res: Response) {
    console.log('ExtractData2');
    let body = res.json();
    AuthService.SetTokens(body);
    return body;
  }
  static HandleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      errMsg = `${error.status} - ${error.statusText || ''} ${error}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
  static refreshTokens2(): Observable<any> {
    let headers = new Headers({ 'Authorization': `${AuthService.tokens.refreshToken}` });
    let options = new RequestOptions({ headers: headers });
    // return this.http.get('http://localhost:3000/auth/refresh-token', options)
    //   .map(this.extractData)
    //   .catch(this.handleError);
    return this.HTTP.get('http://localhost:3000/auth/refresh-token', options)
      .map(AuthService.ExtractData2)
      .catch(AuthService.HandleError);;
  }


  refresh(refreshToken): Observable<any> {
    console.log('refreshToken=', refreshToken);
    let headers = new Headers({ 'authorization': `${refreshToken}` });
    let options = new RequestOptions({ headers: headers });
    return Observable.create(
      observer => {
        this.http.get('http://localhost:3000/auth/refresh-token', options)
          .map(response => response.json())
          .subscribe(data => {
            if (typeof data.error != undefined && data.error === 0) {
              this.setTokens(data);
              observer.next(data.accessToken);
            }
            observer.complete();
          },
          error => {
            this.logOut();
            Observable.throw(error);
          });
      });
  }
  logOut(): any {
    this.setTokens('');
    return this.http.get('http://localhost:3000/auth/logout')
      .map(this.extractData)
      .catch(this.handleError);
  }
  auth(accessToken): Observable<any> {
    let headers = new Headers({ 'Authorization': `JWT ${accessToken}` });
    let options = new RequestOptions({ headers: headers });
    return this.http.get('http://localhost:3000/auth/user', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
}