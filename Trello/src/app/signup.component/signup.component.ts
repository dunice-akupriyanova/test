import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthService } from '../services/auth.service';

import { Injectable }              from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [AuthService]
})
export class SignupComponent {
    constructor (private http: Http, private authService: AuthService) {}
//     postForm(): Observable<any> {
//     return this.http.post('http://localhost:3000/signup')
//                     .map(this.extractData)
//                     .catch(this.handleError);
//   }
//   private extractData(res: Response) {
//     let body = res.json();
//     return body.data || { };
//   }
//   private handleError (error: Response | any) {
//     // In a real world app, you might use a remote logging infrastructure
//     let errMsg: string;
//     if (error instanceof Response) {
//       const body = error.json() || '';
//       const err = body.error || JSON.stringify(body);
//       errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
//     } else {
//       errMsg = error.message ? error.message : error.toString();
//     }
//     console.error(errMsg);
//     return Observable.throw(errMsg);
//   }
  onSubmit(): void {
        this.authService.postForm().subscribe(
                     data  => {},
                     error =>  {});
        console.log("ok");
    }
}
