import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  tokens= {
    accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU4ZDhiYjNmYzgxZTMxZTk3ZDJhNGNmMiIsImV4cCI6MTQ5MDc2Nzc1NTU1OX0.GsTmfU6D8IkoIfdnPaWBlk3Ny_CBqdRQgo0IdFClYrQ"
  };
  constructor (private http: Http) {}
  postForm(username: string, password: string, url: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, { username, password }, options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }
  setTokens(tokens): void {
    this.tokens=tokens;
    console.log('set');
    console.log('accessToken='+this.tokens.accessToken);
  }
  getTokens(): any {
    return this.tokens;
  }
  private extractData(res: Response) {
    let body = res.json();
    return body;
  }
  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    // console.error(errMsg);
    return Observable.throw(errMsg);
  }
  logOut(): Observable<any> {
    return this.http.get('http://localhost:3000/auth/logout')
                    .map(this.extractData)
                    .catch(this.handleError);
  }
  auth(): Observable<any> {
    let headers = new Headers({ 'Authorization': `JWT ${this.tokens.accessToken}` });
    let options = new RequestOptions({ headers: headers });
    console.log('accessToken auth='+this.tokens.accessToken);
    return this.http.get('http://localhost:3000/auth/user', options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }
}