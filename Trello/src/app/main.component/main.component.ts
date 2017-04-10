import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { BoardsService } from '../services/boards.service';
import { BoardService } from '../services/board.service';
import { ModalWindowService } from '../modal-window.component/modal-window.service';
import { JwtHelper } from 'angular2-jwt';
import { User } from '../models/classes/user';
import { Notification } from '../models/classes/notification';
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
    providers: [BackendService, AuthService, UsersService, BoardsService, BoardService, ModalWindowService]
})
export class MainComponent {
    jwtHelper: JwtHelper = new JwtHelper();
    user: User;
    users: Array<User>;
    tokens: any = this.authService.getTokens();
    rights: String;
    oldBoardID: string;
    notifications: Array<Notification>=[];
    notificationBoards: Array<String>=[];
    constructor(
        private backendService: BackendService,
        private usersService: UsersService,
        private boardsService: BoardsService,
        private boardService: BoardService,
        private authService: AuthService,
        private modalWindowService: ModalWindowService,
        private router: Router
    ) { }
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
                this.usersService.getNotification(this.user.username).subscribe(data => {
                    for (let i=0; i<data.length; i++) {
                        this.notifications[i] = new Notification(data[i].username, data[i].boardID, data[i].cards);
                        for (let j=0; j<this.notifications[i].cards.length; j++) {
                            this.notifications[i].cards[j] = this.boardsService.getCardById(this.notifications[i].cards[j].id);
                        }
                        this.notificationBoards.push(this.boardsService.getBoardById(this.notifications[i].boardID).name);
                    }
                });
            });
    }
    redirect(boardID, card): void {
        this.oldBoardID = boardID;
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
    removeNotification(card, notification): void {
        this.usersService.removeNotification(card.id, notification.boardID).subscribe(
            data => {
                console.log(data);
            }
        );
        console.log(notification.cards.indexOf(card));
        notification.cards.splice(notification.cards.indexOf(card), 1);
        if (!notification.cards.length) {
            this.notifications.splice(this.notifications.indexOf(notification), 1);
        }
    }
}
