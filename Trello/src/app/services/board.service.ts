import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Board } from '../models/classes/board';
import { AuthService } from './auth.service';
import { BoardsService } from './boards.service';
import { Card } from '../models/classes/card';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class BoardService {
    tokens = this.authService.getTokens();
    boards: Array<Board> = this.boardsService.getBoards();
    static currentBoard: Board;
    constructor(
        private http: Http,
        private authService: AuthService,
        private boardsService: BoardsService
    ) { }
    private extractData(res: Response) {
        let body = res.json();
        return body;
    }
    private handleError(error: Response | any) {
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
    deleteBoard(id): Observable<any> {
        let headers = new Headers({ 'Authorization': `JWT ${this.tokens.accessToken}` });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(`http://localhost:3000/boards/${id}`, options)
            .map(this.extractData);
    }
    getBoardFromServer(id): Observable<any> {
        this.tokens = this.authService.getTokens();
        let headers = new Headers({ 'Authorization': `JWT ${this.tokens.accessToken}` });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`http://localhost:3000/boards/${id}`, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getBoard(data): Board {
        if (!data) {
            console.log('no data');
            return;
        }
        return new Board(data._id, data.name, data.lists);
        // console.log(BoardsService.boards);
    }
    updateBoard(): Observable<any> {
        console.log('accessToken=' + this.tokens.accessToken);
        let headers = new Headers({ 'Authorization': `JWT ${this.tokens.accessToken}` });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(`http://localhost:3000/boards/${BoardService.currentBoard.id}`, { name: BoardService.currentBoard.name, lists: BoardService.currentBoard.lists }, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    setCurrentBoard(board): void {
        BoardService.currentBoard = board;
    }
    getCurrentBoard(): Board {
        return BoardService.currentBoard;
    }
    getCardById(id): Card {
        // console.log('BoardService.currentBoard getCardById', BoardService.currentBoard);
        for (let j=0; j<BoardService.currentBoard.lists.length; j++) {
            if (BoardService.currentBoard.lists[j].cards.find(element=>element.id==id)) {
                let result = BoardService.currentBoard.lists[j].cards.find(element=>element.id==id);
                console.log('return', result.name);
                return result;
            }
        }
    }
}