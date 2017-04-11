import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Notification } from '../models/notification';
import { BoardsService } from '../services/boards.service';

@Injectable()
export class NotificationsService {
    notifications: Array<any>=[];
    constructor(
        private http: Http,
        private boardsService: BoardsService
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
    setNotification(username, card, board): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let boardID = board.id;
        return this.http.post(`http://localhost:3000/users/notification`, {username, card, boardID}, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getNotification(username): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`http://localhost:3000/users/notification/?username=${username}`, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    removeNotification(username, cardID, boardID): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.delete(`http://localhost:3000/users/notification?cardID=${cardID}&boardID=${boardID}&username=${username}`, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getNotifications(user): Array<any> {
        this.getNotification(user.username).subscribe(data => {
                    let dataLength = data.length;
                    for (let i=0; i<dataLength; i++) {
                        this.notifications[i] = new Notification(data[i].username, data[i].boardID, data[i].cards);
                        let cardsLength = this.notifications[i].cards.length;
                        for (let j=0; j<cardsLength; j++) {
                            let newCard = this.boardsService.getCardById(this.notifications[i].cards[j].id);
                            if (newCard) {
                                this.notifications[i].cards[j] = newCard;
                            } else {
                                this.removeNotification(user.username, this.notifications[i].cards[j].id, data[i].boardID).subscribe(
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
                        this.notifications[i].boardName = this.boardsService.getBoardById(this.notifications[i].boardID).name;
                    }
                });
        return this.notifications;
    }
}