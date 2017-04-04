import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Card } from '../models/classes/card';
import { Comment } from '../models/classes/comment';
import { ModalWindowService } from './modal-window.service';
import { BoardService } from '../services/board.service';
import { UsersService } from '../services/users.service';
import { User } from '../models/classes/user';

@Component({
    selector: 'modal-window',
    templateUrl: './modal-window.component.html',
    styleUrls:['./modal-window.component.css'],
    providers: [BoardService]
})
export class ModalWindowComponent {
    currentCard: Card;
    rights: string;
    newComment: string;
    user: string;
    users: Array<User>;
    constructor(
        private modalWindowService: ModalWindowService,
        private boardService: BoardService,
        private usersService: UsersService
        ) {
        modalWindowService.open.subscribe(data => {
            this.currentCard = <Card>data.card;
            this.rights = data.rights;
            this.user = this.usersService.getUser();
            this.users = this.usersService.getUsers();
            console.log(this.users);
            console.log('ok');
        });
    }
    hideDetails(card: Card): void {
        this.currentCard=null;
    }
    changeCard(): void {
        this.currentCard.date=(new Date()).toLocaleString();
        this.boardService.updateBoard().subscribe();
    }
    addComment(): void {
        if (!this.newComment) { return; }
        this.currentCard.comments.push(new Comment(this.newComment, this.user, (new Date()).toLocaleString()));
        this.newComment = '';
        this.changeCard();
    }
    removeComment(comment): void {
        this.currentCard.comments.splice(this.currentCard.comments.findIndex((element) => element == comment), 1);
        this.changeCard();
    }
    editComment(comment): void {
        comment.isEditing = true;
        comment.oldContent = comment.content;
    }
    endEditing(comment): void {
        comment.isEditing = null;
        comment.date = (new Date()).toLocaleString();
        this.changeCard();
    }
    cancelEditing(comment): void {
        comment.isEditing = null;
        comment.content = comment.oldContent;
        comment.oldContent = null;
    }
}
