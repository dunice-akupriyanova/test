import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { BoardsService } from '../services/boards.service';
import { BoardService } from '../services/board.service';
import { NotificationsService } from '../services/notifications.service';
import { NotificationWebsocketService } from '../services/notification-websocket.service';
import { ModalWindowService } from '../modal-window.component/modal-window.service';
import { JwtHelper } from 'angular2-jwt';
import { User } from '../models/user';
import { Notification } from '../models/notification';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CurrentBoardComponent } from '../current-board.component/current-board.component';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Component({
    selector: 'main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
    providers: [UsersService]
})
export class MainComponent {
    jwtHelper: JwtHelper = new JwtHelper();
    user: User;
    users: Array<User>;
    tokens: any = this.authService.getTokens();
    rights: String;
    notifications: Array<any> = [];
    new: any = {};
    static count: any = {};
    constructor(
        private usersService: UsersService,
        private boardsService: BoardsService,
        private boardService: BoardService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private modalWindowService: ModalWindowService,
        private notificationWebsocketService: NotificationWebsocketService,
        private router: Router
    ) {

    }
    logOut(): void {
        this.authService.logOut().subscribe();
    }
    ngOnInit() {
        this.notificationWebsocketService.notifications.subscribe(msg => {
            if ((<string>msg.title == 'updated') || (<string>msg.title == 'boardsAreUpdated')) {
                return;
            }
            console.log("main, Response from websocket: ", msg);
            this.notifications = this.notificationsService.getNotifications(this.user);
            console.log('ngOnInit, this.notifications=', this.notifications);
            for (let i = 0; i < this.notifications.length; i++) {
                NotificationsService.oldNotifications[i] = new Notification(this.notifications[i].type, this.notifications[i].userID, this.notifications[i].boardID, this.notifications[i].cardID, this.notifications[i].overlooked);
            }
            console.log('subscribe=', NotificationsService.oldNotifications);
        });

        this.boardsService.getBoardsFromServer().subscribe(
            data => {
                this.OnInit(data);
            },
            err => {
                this.authService.refreshTokens(this.tokens.refreshToken).subscribe(
                    data => {
                        this.authService.setTokens(data);
                        this.boardsService.getBoardsFromServer().subscribe(
                            data => {
                                this.OnInit(data);
                            });
                    }
                );
            });
    }
    OnInit(data): void {
        this.boardsService.putBoards(data);
        this.usersService.getUsersFromServer().subscribe(
            data => {
                this.usersService.putUsers(data);
                this.users = this.usersService.getUsers();
                this.user = this.usersService.getUserById(this.jwtHelper.decodeToken(this.tokens.accessToken).id);
                this.notifications = this.notificationsService.getNotifications(this.user);
                this.usersService.refreshUser(this.user);
            });
        MainComponent.count = NotificationsService.count;
        this.new = MainComponent.count;
    }
    redirect(boardID, card?): void {
        this.usersService.getRights(this.user.id, boardID).subscribe(
            data => {
                this.rights = data.rights;
                if (!BoardService.currentBoard) {
                    BoardService.currentBoard = this.boardsService.getBoardById(boardID);
                }
                if ((BoardService.currentBoard.id != boardID)) {
                    BoardService.currentBoard = this.boardsService.getBoardById(boardID);
                }
                this.router.navigate([`/board/${boardID}`]);
                if (!card) {
                    return;
                }
                let opencard = this.boardService.getCardById(card.id);
                this.modalWindowService.openModal(opencard, this.rights, BoardService.currentBoard);
            }
        );
    }
    removeNotification(type, notification, card?): void {
        console.log('remove');
        this.notificationsService.removeNotification(type, this.user.id, notification.boardID).subscribe(
            data => {
                console.log(data);
            }
        );
        this.notifications.splice(this.notifications.indexOf(notification), 1);

    }
    overlook(type, notification, card?): void {
        console.log('overlook');
        this.notificationsService.overlookNotification(type, this.user.id, notification.boardID).subscribe(
            data => {
                console.log(data);
            }
        );
        this.notifications.splice(this.notifications.indexOf(notification), 1);
        for (let i = 0; i < this.notifications.length; i++) {
            NotificationsService.oldNotifications[i] = new Notification(this.notifications[i].type, this.notifications[i].userID, this.notifications[i].boardID, this.notifications[i].cardID, this.notifications[i].overlooked);
        }
        console.log('main NotificationsService.oldNotifications=', NotificationsService.oldNotifications);
    }
    reset(): void {
        MainComponent.count.count = 0;
    }
}
