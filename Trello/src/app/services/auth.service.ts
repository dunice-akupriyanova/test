import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  tokens: any;
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
    console.log(this.tokens);
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
    return this.http.get('http://localhost:3000/auth0/logout')
                    .map(this.extractData)
                    .catch(this.handleError);
  }
}