import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Board } from '../models/board';
import { AuthService } from './auth.service';
import { BoardsService } from './boards.service';
import { Subject } from 'rxjs/Subject';
import { JwtHelper } from 'angular2-jwt';
import { Card } from '../models/card';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class BoardService {
    jwtHelper: JwtHelper = new JwtHelper();
    tokens = this.authService.getTokens();
    boards: Array<Board> = this.boardsService.getBoards();
    static currentBoard: Board;
    refresh = new Subject<any>();
    update = new Subject<any>();
    constructor(
        private http: Http,
        private authService: AuthService,
        private boardsService: BoardsService,

    ) { }
    private extractData(res: Response) {
        let body = res.json();
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
    refreshData(data) {
        this.refresh.next(data);
    }
    update_board(data) {
        this.update.next(data);
    }
    deleteBoard(id): Observable<any> {
        this.tokens = this.authService.getTokens();
        let headers = new Headers({ 'Authorization': `JWT ${this.tokens.accessToken}` });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(`http://localhost:3000/boards/${id}`, options)
            .catch(initialError => {
                if (initialError.status != 401) return Observable.throw(initialError);
                this.authService.refreshTokens(AuthService.tokens.refreshToken).subscribe((data) => {
                    let newHeaders = new Headers({ 'Authorization': `JWT ${AuthService.tokens.accessToken}` });
                    let newOptions = new RequestOptions({ headers: newHeaders });
                    return this.http.delete(`http://localhost:3000/boards/${id}`, newOptions)
                        .map(this.extractData)
                        .catch(this.handleError)
                        .subscribe(data => {
                            this.refreshData(data);
                        });
                });
            })
            .map(res => {
                let body = res.json();
                this.refreshData(body);
                return body;
            });
        // return this.http.delete(`http://localhost:3000/boards/${id}`, options)
        //     .map(this.extractData);
    }
    getBoard(data): Board {
        if (!data) {
            console.log('no data');
            return;
        }
        return new Board(data._id, data.name, data.lists);
    }
    updateBoard(): Observable<any> {
        this.tokens = this.authService.getTokens();
        let headers = new Headers({ 'Authorization': `JWT ${this.tokens.accessToken}` });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(`http://localhost:3000/boards/${BoardService.currentBoard.id}`, { name: BoardService.currentBoard.name, lists: BoardService.currentBoard.lists }, options)
            .catch(initialError => {
                if (initialError.status != 401) return Observable.throw(initialError);
                this.authService.refreshTokens(AuthService.tokens.refreshToken).subscribe((data) => {
                    let newHeaders = new Headers({ 'Authorization': `JWT ${AuthService.tokens.accessToken}` });
                    let newOptions = new RequestOptions({ headers: newHeaders });
                    return this.http.put(`http://localhost:3000/boards/${BoardService.currentBoard.id}`, { name: BoardService.currentBoard.name, lists: BoardService.currentBoard.lists }, newOptions)
                        .map(this.extractData)
                        .catch(this.handleError)
                        .subscribe(data => {
                            this.update_board(data);
                        });
                });
            })
            .map(res => {
                let body = res.json();
                this.update_board(body);
                return body;
            });
        // return this.http.put(`http://localhost:3000/boards/${BoardService.currentBoard.id}`, { name: BoardService.currentBoard.name, lists: BoardService.currentBoard.lists }, options)
        //     .map(this.extractData)
        //     .catch(this.handleError);
    }
    setCurrentBoard(board): void {
        BoardService.currentBoard = board;
    }
    getCurrentBoard(): Board {
        return BoardService.currentBoard;
    }
    getCardById(id): Card {
        if (!BoardService.currentBoard) {
            return;
        }
        for (let j = 0; j < BoardService.currentBoard.lists.length; j++) {
            let result = BoardService.currentBoard.lists[j].cards.find(element => element.id == id);
            if (result) {
                return result;
            }
        }
    }
}