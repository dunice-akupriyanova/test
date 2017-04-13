import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { BoardsService } from '../services/boards.service';
import { BoardService } from '../services/board.service';
import { NotificationsService } from '../services/notifications.service';
import { WebsocketService } from '../services/websocket.service';
import { NotificationWebsocketService } from '../services/notification-websocket.service';
import { ModalWindowService } from '../modal-window.component/modal-window.service';
import { JwtHelper } from 'angular2-jwt';
import { User } from '../models/user';
import { Notification } from '../models/notification';
import { Router } from '@angular/router';
import { CurrentBoardComponent } from '../current-board.component/current-board.component';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Component({
    selector: 'main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
    providers: [ AuthService, UsersService, BoardsService, BoardService, ModalWindowService, NotificationsService, NotificationWebsocketService, WebsocketService]
})
export class MainComponent {
    jwtHelper: JwtHelper = new JwtHelper();
    user: User;
    users: Array<User>;
    tokens: any = this.authService.getTokens();
    rights: String;
    notifications: Array<any>=[];
    new: any={};
    constructor(
        private usersService: UsersService,
        private boardsService: BoardsService,
        private boardService: BoardService,
        private authService: AuthService,
        private notificationsService: NotificationsService,
        private modalWindowService: ModalWindowService,
        private notificationWebsocketService: NotificationWebsocketService,
        private router: Router
    ) {
        
        notificationWebsocketService.notifications.subscribe(msg => {			
            console.log("Response from websocket: ", msg);
            // this.notifications = this.notificationsService.getNotifications(this.user);
            this.boardsService.getBoardsFromServer().subscribe(
            data => {
                 this.boardsService.putBoards(data);
                //  console.log('update');
                 this.notifications = this.notificationsService.getNotifications(this.user);
            
            },
            err => {
                this.authService.refreshTokens(this.tokens.refreshToken).subscribe(
                    data => {
                        this.authService.setTokens(data);
                        this.boardsService.getBoardsFromServer().subscribe(
                            data => {
                                 this.boardsService.putBoards(data);
                                 console.log('update');
                                 this.notifications = this.notificationsService.getNotifications(this.user);
            
                            });
                    }
                );
            });
            let k = this.new.count+1;
            this.new = {};
            this.new.count = k;
            // console.log('new=', this.new);
		});
    }
    logOut(): void {
        this.authService.logOut().subscribe();
    }
    ngOnInit() {
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
                this.user=this.usersService.getUserById(this.jwtHelper.decodeToken(this.tokens.accessToken).id);
                this.notifications = this.notificationsService.getNotifications(this.user);                
            });
        this.new = NotificationsService.count;
    }
    redirectToBoard(boardID): void {
        let id = JSON.parse(localStorage.getItem('UserID')?localStorage.getItem('UserID'):'');
        this.usersService.getRights(id, boardID).subscribe(
            data => {
                this.rights = data.rights;
                if (!BoardService.currentBoard) {
                    BoardService.currentBoard = this.boardsService.getBoardById(boardID);
                }
                if ((BoardService.currentBoard.id!=boardID)) {
                    BoardService.currentBoard = this.boardsService.getBoardById(boardID);
                }
                this.router.navigate([`/board/${boardID}`]);
            }
        );
    }
    redirect(boardID, card): void {
        let id = JSON.parse(localStorage.getItem('UserID')?localStorage.getItem('UserID'):'');
        this.usersService.getRights(id, boardID).subscribe(
            data => {
                this.rights = data.rights;
                if (!BoardService.currentBoard) {
                    BoardService.currentBoard = this.boardsService.getBoardById(boardID);
                }
                if ((BoardService.currentBoard.id!=boardID)) {
                    BoardService.currentBoard = this.boardsService.getBoardById(boardID);
                }
                this.router.navigate([`/board/${boardID}`]);
                let opencard = this.boardService.getCardById(card.id);
                this.modalWindowService.openModal(opencard, this.rights, BoardService.currentBoard);
            }
        );
    }
    removeNotification(type, notification, card?): void {
        console.log('remove');
        if (type=='card') {
            this.notificationsService.removeNotification(type, this.user.id, notification.boardID, card.id).subscribe(
                data => {
                    console.log(data);
                }
            );
            console.log(notification.cards.indexOf(card));
            notification.cards.splice(notification.cards.indexOf(card), 1);
            if (!notification.cards.length) {
                this.notifications.splice(this.notifications.indexOf(notification), 1);
            }
        } else {
            this.notificationsService.removeNotification(type, this.user.id, notification.boardID).subscribe(
                data => {
                    console.log(data);
                }
            );
            this.notifications.splice(this.notifications.indexOf(notification), 1);
        }
    }
    check(): void {

        // this.notificationWebsocketService.notifications.next(this.notifications[0]);
    }
    reset(): void {
        this.new.count=0;
    }
}
