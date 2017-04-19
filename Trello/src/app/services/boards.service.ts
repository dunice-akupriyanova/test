import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Board } from '../models/board';
import { Card } from '../models/card';
import { List } from '../models/list';
import { Subscription } from 'rxjs/Subscription'
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BoardService } from './board.service';
import { JwtHelper } from 'angular2-jwt';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class BoardsService {
  jwtHelper: JwtHelper = new JwtHelper();
  tokens = this.authService.getTokens();
  static boards: Array<Board> = [];
  refresh = new Subject<any>();
  add = new Subject<any>();
  constructor(private http: Http,
    private authService: AuthService,
    private usersService: UsersService,
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
  getBoardsFromServer(): Observable<any> {
    this.tokens = this.authService.getTokens();
    let headers = new Headers({ 'Authorization': `JWT ${this.tokens.accessToken}` });
    let options = new RequestOptions({ headers: headers });
    return this.http.get('http://localhost:3000/boards', options)
      .catch(initialError => {
        if (initialError.status != 401) return Observable.throw(initialError);
        this.authService.refreshTokens(AuthService.tokens.refreshToken).subscribe((data) => {
          let newHeaders = new Headers({ 'Authorization': `JWT ${AuthService.tokens.accessToken}` });
          let newOptions = new RequestOptions({ headers: newHeaders });
          return this.http.get('http://localhost:3000/boards', newOptions)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(data => {
              this.putBoards(data);
              this.refreshData(data);
            });
        });
      })
      .map(res => {
        let body = res.json();
        this.putBoards(body);
        // this.refreshData(body);
        return body;
      });
    // return this.http.get('http://localhost:3000/boards', options)
    //   .map(this.extractData)
    //   .catch(this.handleError);
  }
  refreshData(data) {
    this.refresh.next(data);
  }
  add_board(data) {
    this.add.next(data);
  }
  putBoards(data): void {
    console.log('putBoards');
    if (!data) {
      console.log('no data');
      return;
    }
    BoardsService.boards = [];
    for (let i = 0; i < data.length; i++) {
      BoardsService.boards[i] = new Board(data[i]._id, data[i].name, data[i].lists);
    }
  }
  getBoards(): Array<Board> {
    return BoardsService.boards;
  }
  addBoard(name): Observable<any> {
    this.tokens = this.authService.getTokens();
    let headers = new Headers({ 'Authorization': `JWT ${this.tokens.accessToken}` });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('http://localhost:3000/boards', { name }, options)
      .catch(initialError => {
        if (initialError.status != 401) return Observable.throw(initialError);
        this.authService.refreshTokens(AuthService.tokens.refreshToken).subscribe((data) => {
          let newHeaders = new Headers({ 'Authorization': `JWT ${AuthService.tokens.accessToken}` });
          let newOptions = new RequestOptions({ headers: newHeaders });
          return this.http.post('http://localhost:3000/boards', { name }, newOptions)
            .map(this.extractData)
            .catch(this.handleError)
            .subscribe(data => {
              this.add_board(data);
            });
        });
      })
      .map(res => {
        let body = res.json();
        this.add_board(body);
        return body;
      });
    // return this.http.post('http://localhost:3000/boards', { name }, options)
    //   .map(this.extractData)
    //   .catch(this.handleError);
  }
  getBoardById(id): Board {
    let result = BoardsService.boards.find(element => element.id == id);
    return result;
  }
  getCardById(board, id): Card {
    for (let list of board.lists) {
      let found = list.cards.find(element => element.id == id);
      if (found) {
        console.log('found');
        return found;
      }
    }
  }
}