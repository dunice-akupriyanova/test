import { Component, Input, Output, EventEmitter, OnInit  } from '@angular/core';
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

@Component({
    selector: 'modal-window',
    templateUrl: './modal-window.component.html',
    styleUrls:['./modal-window.component.css'],
    providers: [BoardService, AuthService, UsersService, NotificationsService]
})
export class ModalWindowComponent {
    currentCard: Card;
    rights: string;
    jwtHelper: JwtHelper = new JwtHelper();
    newComment = '';
    user: string;
    users: Array<User>;
    searching: Boolean = false;
    searchString: String='';
    searchResult: Array<String>=[];
    currentBoard: Board;
    target: any;
    tokens: any = this.authService.getTokens();  
    newCommentIsEditing: Boolean = false;
    constructor(
        private modalWindowService: ModalWindowService,
        private boardService: BoardService,
        private usersService: UsersService,
        private authService: AuthService,
        private notificationsService: NotificationsService
        ) {
        modalWindowService.open.subscribe(data => {
            this.currentCard = <Card>data.card;
            // console.log('modal card ', this.currentCard);
            this.rights = data.rights;
            this.currentBoard = <Board>data.board;
            // console.log('modal board ', this.currentBoard);
            this.user = this.usersService.getUser();
            this.users = this.usersService.getUsers();
            // console.log(this.users);
            // console.log('ok');
        });
    }
    hideDetails(card: Card): void {
        this.newComment = '';
        this.currentCard=null;
    }
    changeCard(): void {
        this.currentCard.date=(new Date()).toLocaleString();
        this.boardService.updateBoard().subscribe(
            data => {},
                    err => {
                        this.authService.refreshTokens(this.tokens.refreshToken).subscribe(
                            data => {
                                        this.authService.setTokens(data);
                                        console.log('after refresh');
                                        this.boardService.updateBoard().subscribe();
                                    });
                    });
    }
    addComment(): void {
        if (!this.newComment) { return; }
        // console.log('this.newComment=', this.newComment);
        this.currentCard.comments.push(new Comment(this.newComment, this.user, (new Date()).toLocaleString()));
        this.setNotification(this.searchNotifications(this.newComment));
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
        this.setNotification(this.searchNotifications(comment.content));
        this.changeCard();
    }
    cancelEditing(comment): void {
        comment.isEditing = null;
        comment.content = comment.oldContent;
        comment.oldContent = null;
    }
    check(value: String): void {
        this.target = event.target;

        if (value[value.length-1]=='@') {
            this.searching = true;
            return;
        }
        if ((this.searching)&&(value[value.length-1]==' ')) {
            this.searching = false;
            this.searchString = '';
            return;
        }
        if (this.searching) {
            if (value.indexOf('@')==-1) {
                this.searching = false;
                this.searchString = '';
                this.searchResult=[];
            }
            this.searchString=value.substring(value.lastIndexOf('@')+1);
            this.searchUser(this.searchString, this.target);
        }
        // console.log('this.searchString='+this.searchString);
        // console.log('result:');
        // console.log(this.searchResult);
    }
    searchUser(value, target): void {
        this.searchResult=[];
        for (let i=0; i<this.users.length; i++){
            if (this.users[i].username==value) {
                this.searchResult=[];
                return;
            }
            if (this.users[i].username.indexOf(value)!=-1) {
                this.searchResult.push(this.users[i].username);
            }
        }
    }
    choose(name, k): void {
        let revers = this.target.value.split("").reverse().join("");
        let reversName = name.split("").reverse().join("");
        revers = revers.replace(revers.substring(0, revers.indexOf('@')), reversName);
        revers = revers.split("").reverse().join("");
        if (k===undefined) {
            this.newComment = revers;
        } else {
            this.currentCard.comments[k].content = revers;
        }
        this.searchResult=[];
        this.target.focus();
    }
    searchNotifications(value): Array<string> {
        let result: Array<string>=[];
        let last = 0;
        let count = 0;
        while ((value.indexOf('@', last)!=-1)&&(count<10)) {
            count++;
            last = value.indexOf('@', last)+1;
            if (last!=-1) {
                let end = Math.min(((value.indexOf(' ', last)==-1)?999999:value.indexOf(' ', last)), ((value.indexOf('.', last)==-1)?999999:value.indexOf('.', last)), ((value.indexOf(',', last)==-1)?999999:value.indexOf(',', last)), ((value.indexOf(':', last)==-1)?999999:value.indexOf(':', last)), ((value.indexOf(';', last)==-1)?999999:value.indexOf(';', last)));
                let newResult = value.substring(last,  (end==999999)?value.length:end);
                if (this.userExist(newResult)&&(result.indexOf(newResult)==-1)) {
                    result.push(newResult);
                }
            }
        }
        // console.log('searchNotification');
        // console.log(result);
        return result;
    }
    userExist(username): Boolean {
        for (let i=0; i< this.users.length; i++) {
            if (this.users[i].username==username) {
                return true;
            }
        }
        return false;
    }
    setNotification(data): void {
        console.log('setNotification', data);
        for (let i=0; i<data.length; i++)
        this.notificationsService.setNotification(data[i], this.currentCard, this.currentBoard).subscribe(data => {
            console.log(data);
        });
    }
    change(user): void {
        if (!event.srcElement.hasAttribute('checked')) {
            this.currentCard.members.push(user.username);
            this.changeCard();
            event.srcElement.setAttribute('checked', '');
        } else {
            this.currentCard.members.splice(this.currentCard.members.indexOf(user.username), 1);
            this.changeCard();
            event.srcElement.removeAttribute('checked');
        }
    }
}
