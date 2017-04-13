import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Notification } from '../models/notification';
import { BoardsService } from '../services/boards.service';
import { BoardService } from '../services/board.service';
import { NotificationWebsocketService } from '../services/notification-websocket.service';

@Injectable()
export class NotificationsService {
    notifications: Array<any>=[];
    static count = {count: 0};
    constructor(
        private http: Http,
        private boardsService: BoardsService,
        private boardService: BoardService,
        private notificationWebsocketService: NotificationWebsocketService
    ) { }
    private extractData(res: Response) {
        let body = res.json();
        return body;
    }
    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            console.log(error);
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
    setNotification(type, userID, board, card?): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let boardID = board.id;
        return this.http.post(`http://localhost:3000/users/notification`, {type, userID, card, boardID}, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getNotification(userID): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`http://localhost:3000/users/notification/?userID=${userID}`, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    removeNotification(type, userID, boardID, cardID?): Observable<any> {
        console.log('removeNotification');
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(`http://localhost:3000/users/notification?type=${type}&cardID=${cardID}&boardID=${boardID}&userID=${userID}`, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getNotifications(user): Array<any> {
        this.getNotification(user.id).subscribe(data => {
                    let dataLength = data.length;
                    for (let i=0; i<dataLength; i++) {
                        this.notifications[i] = new Notification(data[i].type, data[i].userID, data[i].boardID, data[i].cards);
                        let cardsLength = this.notifications[i].cards.length;
                        for (let j=0; j<cardsLength; j++) {
                            let newCard = this.boardsService.getCardById(this.notifications[i].cards[j].id)||this.boardService.getCardById(this.notifications[i].cards[j].id);
                            if (newCard) {
                                this.notifications[i].cards[j] = newCard;
                            } else {
                                console.log('not found!');
                                this.removeNotification(this.notifications[i].type, user.id, data[i].boardID, this.notifications[i].cards[j].id).subscribe(
                                    data => {
                                        console.log(data);
                                    }
                                );
                                this.notifications[i].cards.splice(j, 1);
                                if (!this.notifications[i].cards.length) {
                                    this.notifications.splice(i, 1);
                                    dataLength--;
                                    i--;
                                }
                                j--;
                                cardsLength--;
                            }
                        }
                        NotificationsService.count.count+=cardsLength;
                        let board = this.boardsService.getBoardById(this.notifications[i].boardID);
                        // console.log('found=', this.boardsService.getBoardById(this.notifications[i].boardID));
                        if (board) {
                            this.notifications[i].boardName = this.boardsService.getBoardById(this.notifications[i].boardID).name;               
                        }         
                    }
                    // NotificationsService.count.count = dataLength;
                });
        return this.notifications;
    }
}