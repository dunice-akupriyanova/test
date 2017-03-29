import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Board } from '../models/classes/board';
import { AuthService } from './auth.service';
import { BoardsService } from './boards.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class BoardService {
    tokens = this.authService.getTokens();
    boards: Array<Board> = this.boardsService.getBoards();
    constructor(private http: Http, private authService: AuthService, private boardsService: BoardsService) { }
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
    getBoardByID(id: number | string) {
        console.log('getBoardByID');
        console.log(this.boards);
        return this.boards.find((element) => element.id == id);
    }
    deleteBoard(id): Observable<any> {
        let headers = new Headers({ 'Authorization': `JWT ${this.tokens.accessToken}` });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(`http://localhost:3000/boards/${id}`, options)
            .map(this.extractData);
    }
}