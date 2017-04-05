import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Card } from '../models/classes/card';
import { Board } from '../models/classes/board';
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
    searching: Boolean = false;
    searchString: String='';
    searchResult: Array<String>=[];
    currentBoard: Board;
    constructor(
        private modalWindowService: ModalWindowService,
        private boardService: BoardService,
        private usersService: UsersService
        ) {
        modalWindowService.open.subscribe(data => {
            this.currentCard = <Card>data.card;
            this.rights = data.rights;
            this.currentBoard = <Board>data.board;
            this.user = this.usersService.getUser();
            this.users = this.usersService.getUsers();
            console.log(this.users);
            console.log('ok');
        });
    }
    hideDetails(card: Card): void {
        this.newComment = '';
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
    check(value: String): void {
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
            this.search(this.searchString);
        }
        // console.log('this.searchString='+this.searchString);
        // console.log('result:');
        // console.log(this.searchResult);
    }
    search(value): void {
        this.searchResult=[];
        for (let i=0; i<this.users.length; i++){
            if (this.users[i].username==value) {
                this.choose(value);
                return;
            }
            if (this.users[i].username.indexOf(value)!=-1) {
                this.searchResult.push(this.users[i].username);
            }
        }
    }
    choose(name): void {
        let replace = this.newComment.substring(this.newComment.lastIndexOf('@')+1);
        let revers = this.newComment.split("").reverse().join("");
        let reversName = name.split("").reverse().join("");
        revers = revers.replace(revers.substring(0, revers.indexOf('@')), reversName);
        revers = revers.split("").reverse().join("");
        // this.newComment=this.newComment.replace(this.newComment.substring(this.newComment.lastIndexOf('@')+1), name);
        this.newComment = revers;
        this.searchResult=[];
        document.getElementById('new_comment').focus();
        this.setNotification(name);
    }
    setNotification(name): void {
        this.usersService.setNotification(name, this.currentCard, this.currentBoard).subscribe(data => {
            console.log(data);
        });
    }
}
