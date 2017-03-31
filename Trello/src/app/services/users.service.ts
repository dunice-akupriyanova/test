import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/classes/user';
import { AuthService } from './auth.service';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {
    static users: Array<any> = [];
    jwtHelper: JwtHelper = new JwtHelper();
    tokens = this.authService.getTokens(); //????????????/
    static user: User;
    constructor(
        private http: Http,
        private authService: AuthService,
    ) { }
    private extractData(res: Response) {
        let body = res.json();
        return body;
    }
    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
    getUsersFromServer(): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get('http://localhost:3000/users', options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    putUsers(data): void {
        if (!data) {
            console.log('no data');
            return;
        }
        for (let i = 0; i < data.length; i++) {
            UsersService.users[i] = new User(data[i]._id, data[i].username);
        }
        UsersService.user = this.getUserById(this.jwtHelper.decodeToken(this.tokens.accessToken).id);
        localStorage.setItem('UserID', JSON.stringify(UsersService.user.id));
    }
    getUsers(): Array<User> {
        return UsersService.users;
    }
    getUserById(id): User {
        let result = UsersService.users.find(element=>element.id==id);
        return result;
    }
    getUser(): User {
        return UsersService.user;
    }
    // putUser(): void {
    //     console.log('before');
    //     console.log(UsersService.user);
    //     console.log('id='+this.jwtHelper.decodeToken(this.tokens.accessToken).id);
    //     UsersService.user = this.getUserById(this.jwtHelper.decodeToken(this.tokens.accessToken).id);
    //     console.log('after');
    //     console.log(UsersService.user);
    //     localStorage.setItem('UserID', JSON.stringify(UsersService.user.id));
    // }
    setRights(userID, boardID, rights): Observable<any> {
        // console.log('boardID='+boardID);
        // console.log('rights='+rights);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('http://localhost:3000/users/rights', { userID, boardID, rights }, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getRights(userID, boardID): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(`http://localhost:3000/users/rights/user`, { userID, boardID }, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
}