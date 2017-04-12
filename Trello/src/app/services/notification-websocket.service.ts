import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Notification } from '../models/notification';
import { WebsocketService } from './websocket.service';
 
// const NOTIFICATIONS_URL = 'ws://echo.websocket.org/';
const NOTIFICATIONS_URL = 'ws://localhost:8080/';
 
@Injectable()
export class NotificationWebsocketService {
	public notifications: Subject<Notification>;
 
	constructor(wsService: WebsocketService) {
		this.notifications = <Subject<Notification>>wsService
			.connect(NOTIFICATIONS_URL)
			.map((response: MessageEvent): Notification => {
				// console.log('Notification');
				let data = JSON.parse(response.data);
				return data;
			});
	}
}