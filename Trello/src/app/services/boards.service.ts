import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Board } from '../models/board';
import { Card } from '../models/card';
import { AuthService } from './auth.service';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class BoardsService {
  jwtHelper: JwtHelper = new JwtHelper();
  tokens = this.authService.getTokens();
  static boards: Array<Board> = [];
  constructor(private http: Http, private authService: AuthService) { }
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
  getBoardsFromServer(): Observable<any> {
    this.tokens = this.authService.getTokens();
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
  addBoard(name): Observable<any> {
    this.tokens = this.authService.getTokens();
    let headers = new Headers({ 'Authorization': `JWT ${this.tokens.accessToken}` });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('http://localhost:3000/boards', { name }, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getBoardById(id): Board {
      let result = BoardsService.boards.find(element=>element.id==id);
      return result;
  }
  getCardById(id): Card {
    for (let i=0; i<BoardsService.boards.length; i++) {
      for (let j=0; j<BoardsService.boards[i].lists.length; j++) {
          if (BoardsService.boards[i].lists[j].cards.find(element=>element.id==id)) {
              return BoardsService.boards[i].lists[j].cards.find(element=>element.id==id);
          }
      }
    }
  }
}