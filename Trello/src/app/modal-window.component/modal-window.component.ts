import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
// import { ComponentRef, ComponentResolver, Type, ViewChild, ViewContainerRef } from "angular2/core";

import { Card } from '../models/card';
import { Board } from '../models/board';
import { Comment } from '../models/comment';
import { ModalWindowService } from './modal-window.service';
import { BoardService } from '../services/board.service';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import { NotificationsService } from '../services/notifications.service';
import { JwtHelper } from 'angular2-jwt';
import { User } from '../models/user';
import { BoardsService } from '../services/boards.service';
import { NotificationWebsocketService } from '../services/notification-websocket.service';

@Component({
    selector: 'modal-window',
    templateUrl: './modal-window.component.html',
    styleUrls: ['./modal-window.component.css'],
    providers: []
})
export class ModalWindowComponent {
    currentCard: Card;
    rights: string;
    jwtHelper: JwtHelper = new JwtHelper();
    newComment = '';
    user: string;
    users: Array<User>;
    searching: Boolean = false;
    searchString: String = '';
    searchResult: Array<String> = [];
    currentBoard: Board;
    target: any;
    tokens: any = this.authService.getTokens();
    newCommentIsEditing: Boolean = false;
    id: number | string;
    constructor(
        private modalWindowService: ModalWindowService,
        private boardService: BoardService,
        private boardsService: BoardsService,
        private usersService: UsersService,
        private authService: AuthService,
        private notificationsService: NotificationsService,
        private notificationWebsocketService: NotificationWebsocketService
    ) {
        modalWindowService.open.subscribe(data => {
            this.currentCard = <Card>data.card;
            this.id = this.currentCard.id;
            this.rights = data.rights;
            this.currentBoard = <Board>data.board;
            this.user = this.usersService.getUser().username;
            this.users = this.usersService.getUsers();
        });
        this.notificationWebsocketService.notifications.subscribe(msg => {
            if (<string>msg.title != 'updated') {
                return;
            }
            console.log('Modal Window, response: ', msg);
            let boardID = msg.payload._id;
            this.boardsService.getBoardsFromServer().subscribe(data => {
                console.log('data');
                this.refresh(boardID);
            }, err => { });
            this.boardsService.refresh.subscribe(data => {
                this.refresh(boardID);
            });
            // this.boardsService.getBoardsFromServer().subscribe(
            //     data => {
            //         this.boardsService.putBoards(data);
            //         if (!BoardService.currentBoard || BoardService.currentBoard.id != boardID) { return; }

            //         BoardService.currentBoard = this.boardsService.getBoardById(boardID);
            //         this.currentBoard = BoardService.currentBoard;
            //         // console.log('updated'); 
            //         this.modalWindowService.refreshBoard(this.currentBoard);
            //         if (!this.id) { return; }
            //         this.currentCard = this.boardService.getCardById(this.id);
            //     },
            //     err => {
            //         this.authService.refreshTokens(this.tokens.refreshToken).subscribe(
            //             data => {
            //                 this.authService.setTokens(data);
            //                 this.boardsService.getBoardsFromServer().subscribe(
            //                     data => {
            //                         this.boardsService.putBoards(data);
            //                         if (!BoardService.currentBoard || BoardService.currentBoard.id != boardID) { return; }
            //                         BoardService.currentBoard = this.boardsService.getBoardById(boardID);
            //                         this.currentBoard = BoardService.currentBoard;
            //                         // console.log('updated'); 
            //                         this.modalWindowService.refreshBoard(this.currentBoard);
            //                         if (!this.id) { return; }
            //                         this.currentCard = this.boardService.getCardById(this.id);
            //                     });
            //             }
            //         );
            //     });
        });
    }
    refresh(boardID): void {
        if (!BoardService.currentBoard || BoardService.currentBoard.id != boardID) { return; }
        BoardService.currentBoard = this.boardsService.getBoardById(boardID);
        this.currentBoard = BoardService.currentBoard;
        this.modalWindowService.refreshBoard(this.currentBoard);
        if (!this.id) { return; }
        this.currentCard = this.boardService.getCardById(this.id);
    }
    hideDetails(card: Card): void {
        this.newComment = '';
        this.id = null;
        this.currentCard = null;
    }
    changeCard(): void {
        this.currentCard.date = (new Date()).toLocaleString();
        this.boardService.updateBoard().subscribe(data => {
                console.log('data');
            }, err => { });
            this.boardService.update.subscribe();
        // this.boardService.updateBoard().subscribe(
        //     data => { },
        //     err => {
        //         this.authService.refreshTokens(this.tokens.refreshToken).subscribe(
        //             data => {
        //                 this.authService.setTokens(data);
        //                 console.log('after refresh');
        //                 this.boardService.updateBoard().subscribe();
        //             });
        //     });
    }
    addComment(): void {
        if (!this.newComment) { return; }
        // console.log('this.newComment=', this.newComment);
        this.currentCard.comments.push(new Comment(this.newComment, this.user, (new Date()).toLocaleString()));
        this.setNotification('card', this.searchNotifications(this.newComment));
        this.newComment = '';
        this.changeCard();
        this.newCommentIsEditing = false;
    }
    removeComment(comment): void {
        this.currentCard.comments.splice(this.currentCard.comments.findIndex((element) => element == comment), 1);
        this.changeCard();
    }
    editComment(comment): void {
        comment.oldContent = comment.content;
        comment.isEditing = true;
    }
    endEditing(comment): void {
        comment.oldContent = comment.content;
        comment.isEditing = null;
        comment.date = (new Date()).toLocaleString();
        this.setNotification('card', this.searchNotifications(comment.content));
        this.changeCard();
    }
    cancelEditing(comment): void {
        comment.isEditing = null;
        comment.content = comment.oldContent;
        comment.oldContent = null;
    }
    check(value: String, event): void {
        this.target = event.target;

        if (value[value.length - 1] == '@') {
            this.searching = true;
            return;
        }
        if ((this.searching) && (value[value.length - 1] == ' ')) {
            this.searching = false;
            this.searchString = '';
            return;
        }
        if (this.searching) {
            if (value.indexOf('@') == -1) {
                this.searching = false;
                this.searchString = '';
                this.searchResult = [];
            }
            this.searchString = value.substring(value.lastIndexOf('@') + 1);
            this.searchUser(this.searchString, this.target);
        }
        // console.log('this.searchString='+this.searchString);
        // console.log('result:');
        // console.log(this.searchResult);
    }
    searchUser(value, target): void {
        this.searchResult = [];
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].username == value) {
                this.searchResult = [];
                return;
            }
            if (this.users[i].username.indexOf(value) != -1) {
                this.searchResult.push(this.users[i].username);
            }
        }
    }
    choose(name, k): void {
        let revers = this.target.value.split("").reverse().join("");
        let reversName = name.split("").reverse().join("");
        revers = revers.replace(revers.substring(0, revers.indexOf('@')), reversName);
        revers = revers.split("").reverse().join("");
        if (k === undefined) {
            this.newComment = revers;
        } else {
            this.currentCard.comments[k].content = revers;
        }
        this.searchResult = [];
        this.target.focus();
    }
    searchNotifications(value): Array<string> {
        let result: Array<string> = [];
        let last = 0;
        let count = 0;
        while ((value.indexOf('@', last) != -1) && (count < 10)) {
            count++;
            last = value.indexOf('@', last) + 1;
            if (last != -1) {
                let end = Math.min(((value.indexOf(' ', last) == -1) ? 999999 : value.indexOf(' ', last)), ((value.indexOf('.', last) == -1) ? 999999 : value.indexOf('.', last)), ((value.indexOf(',', last) == -1) ? 999999 : value.indexOf(',', last)), ((value.indexOf(':', last) == -1) ? 999999 : value.indexOf(':', last)), ((value.indexOf(';', last) == -1) ? 999999 : value.indexOf(';', last)));
                let newResult = value.substring(last, (end == 999999) ? value.length : end);
                newResult = this.getUser(newResult);
                if (newResult && (result.indexOf(newResult) == -1)) {
                    result.push(newResult);
                }
            }
        }
        // console.log('result=', result);
        // console.log('searchNotification');
        // console.log(result);
        return result;
    }
    getUser(username): string {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].username == username) {
                return <string>this.users[i].id;
            }
        }
        return '';
    }
    setNotification(type, data): void {
        console.log('setNotification', data);
        for (let i = 0; i < data.length; i++) {
            this.notificationsService.setNotification(type, data[i], this.currentBoard, this.currentCard).subscribe(data => {
                console.log('from server', data);
            });
        }
    }
    changeMember(user, event): void {
        if (!event.target.hasAttribute('checked')) {
            this.currentCard.members.push(user.username);
            this.notificationsService.setNotification('card', user.id, this.currentBoard, this.currentCard).subscribe(data => {
                console.log('from server', data);
            });
            this.changeCard();
            event.target.setAttribute('checked', '');
        } else {
            this.currentCard.members.splice(this.currentCard.members.indexOf(user.username), 1);
            this.notificationsService.setNotification('card', user.id, this.currentBoard, this.currentCard).subscribe(data => {
                console.log('from server', data);
            });
            this.changeCard();
            event.target.removeAttribute('checked');
        }
    }
}
