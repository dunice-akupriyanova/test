import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Notification } from '../models/notification';
import { WebsocketService } from './websocket.service';

// const NOTIFICATIONS_URL = 'ws://echo.websocket.org/';
const NOTIFICATIONS_URL = 'ws://localhost:8080/';

@Injectable()
export class NotificationWebsocketService {
	public notifications: Observable<any>;

	constructor(wsService: WebsocketService) {
		this.notifications = wsService
			.connect(NOTIFICATIONS_URL)
			.map((response: MessageEvent): any => {
				let data = JSON.parse(response.data);
				return data;
			}).share();
	}
}