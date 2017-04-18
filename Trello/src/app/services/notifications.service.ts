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
    notifications: Array<any> = [];
    static count = { count: 0 };
    static oldCount = { count: 0 };
    static oldNotifications: Array<Notification> = [];
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
            errMsg = `${error.status} - ${error.statusText || ''} ${error}`;
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
        let cardID;
        if (card) {
            cardID = card.id;
        }
        return this.http.post(`http://localhost:3000/users/notification`, { type, userID, cardID, boardID }, options)
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
    overlookNotification(type, userID, boardID, cardID?): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(`http://localhost:3000/users/notification`, { type, userID, cardID, boardID }, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getNotifications(user): Array<any> {
        this.getNotification(user.id).subscribe(data => {
            let dataLength = data.length;
            for (let i = 0; i < dataLength; i++) {
                if (data[i].overlooked) {
                    dataLength--;
                    data.splice(i, 1);
                    i--;
                    continue;
                }
                this.notifications[i] = new Notification(data[i].type, data[i].userID, data[i].boardID, data[i].cardID, data[i].overlooked);
                let board = this.boardsService.getBoardById(this.notifications[i].boardID);
                this.notifications[i].boardName = board ? board.name : '';
                if (!this.notifications[i].boardName) {
                    console.log('board is not found');
                    this.removeNotification('board', user.id, data[i].boardID).subscribe();
                    this.notifications.splice(i, 1);
                    data.splice(i, 1);
                    dataLength--;
                    i--;
                }
                if (data[i].type == 'board') {
                    continue;
                }
                this.notifications[i].card = this.boardsService.getCardById(data[i].cardID) || this.boardService.getCardById(data[i].cardID);
                if (!this.notifications[i].card) {
                    console.log('card is not found');
                    this.removeNotification(data[i].type, user.id, data[i].boardID, data[i].cardID).subscribe();
                    data.splice(i, 1);
                    this.notifications.splice(i, 1);
                    dataLength--;
                    i--;
                }
            }
            this.setCount();
            return this.notifications;
        });
        return this.notifications;
    }
    setCount(): void {
        // console.log('NotificationsService.oldNotifications=', NotificationsService.oldNotifications);
        // console.log('this.notifications=', this.notifications);
        if (!NotificationsService.oldNotifications.length) {
            NotificationsService.count.count = this.notifications.length;
            return;
        }
        let equal = true;
        if (this.notifications.length != NotificationsService.oldNotifications.length) {
            NotificationsService.count.count++;
            return;
        }
        for (let i = 0; i < this.notifications.length; i++) {
            if ((this.notifications[i].boardID != NotificationsService.oldNotifications[i].boardID) || (this.notifications[i].overlooked != NotificationsService.oldNotifications[i].overlooked)) {
                equal = false;
                break;
            }
            if (!this.notifications[i].cardID) {
                continue;
            }
            if (this.notifications[i].cardID != NotificationsService.oldNotifications[i].cardID) {
                equal = false;
                break;
            }
        }
        if (!equal) {
            NotificationsService.count.count++;
        }
    }
}