import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Board } from '../models/classes/board';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class BoardsService {
  static boards: Array<Board> = [];
  constructor(private http: Http, private authService: AuthService) { }
  private extractData(res: Response) {
    let body = res.json();
    return body;
  }
  currentBoard: Board;
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
  tokens = this.authService.getTokens();
  getBoardsFromServer(): Observable<any> {
    let headers = new Headers({ 'Authorization': `JWT ${this.tokens.accessToken}` });
    let options = new RequestOptions({ headers: headers });
    return this.http.get('http://localhost:3000/boards', options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  putBoards(data): void {
    if (!data) {
      console.log('no data');
      return;
    }
    for (let i = 0; i < data.length; i++) {
      BoardsService.boards[i] = new Board(data[i]._id, data[i].name, data[i].lists);
    }
    // console.log(BoardsService.boards);
  }
  getBoards(): Array<Board> {
    return BoardsService.boards;
  }
  getBoardByID(id: number | string) {
      return BoardsService.boards.find((element) => element.id == id);
  }
  addBoard(name): Observable<any> {
    let headers = new Headers({ 'Authorization': `JWT ${this.tokens.accessToken}` });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('http://localhost:3000/boards', { name }, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  setCurrentBoard(board: Board): void {
    this.currentBoard=board;
    console.log('setCurrentBoard');
    console.log(this.currentBoard);
  }
  getCurrentBoard(): Board {
    console.log('getCurrentBoard');
    console.log(this.currentBoard);
    return this.currentBoard;
  }
}