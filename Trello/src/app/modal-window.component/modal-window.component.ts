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
    newComment = {comment: ''};
    user: string;
    users: Array<User>;
    searching: Boolean = false;
    searchString: String='';
    searchResult: Array<String>=[];
    currentBoard: Board;
    target: any;
    object: any;
    constructor(
        private modalWindowService: ModalWindowService,
        private boardService: BoardService,
        private usersService: UsersService
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
        this.newComment.comment = '';
        this.currentCard=null;
    }
    changeCard(): void {
        this.currentCard.date=(new Date()).toLocaleString();
        this.boardService.updateBoard().subscribe();
    }
    addComment(): void {
        if (!this.newComment.comment) { return; }
        console.log('this.newComment.comment=', this.newComment.comment);
        this.currentCard.comments.push(new Comment(this.newComment.comment, this.user, (new Date()).toLocaleString()));
        this.setNotification(this.searchNotifications(this.newComment.comment));
        this.newComment.comment = '';
        this.changeCard();
    }
    removeComment(comment): void {
        this.currentCard.comments.splice(this.currentCard.comments.findIndex((element) => element == comment), 1);
        this.changeCard();
    }
    editComment(comment): void {
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
    check(value: String, object: any): void {
        this.target = event.target;
        if (this.target.getAttribute('id')=='new_comment') {
            console.log('ok');
        };
        
        let search = document.getElementById(this.target.getAttribute('id'));
        // console.log(search.parentNode);
        let parent = search.parentNode;
        // console.log(typeof parent);
        // parent.insertBefore(document.getElementById('search'), search.nextSibling);
        // console.log(this.target);
        // console.log(this.target.getAttribute('id'));
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
                console.log('searchUser target=', target);
                this.searchResult=[];
                return;
            }
            if (this.users[i].username.indexOf(value)!=-1) {
                this.searchResult.push(this.users[i].username);
            }
        }
    }
    choose(name, target): void {
        // console.log('choose target', target);
        let replace = target.value.substring(target.value.lastIndexOf('@')+1);
        let revers = target.value.split("").reverse().join("");
        let reversName = name.split("").reverse().join("");
        revers = revers.replace(revers.substring(0, revers.indexOf('@')), reversName);
        revers = revers.split("").reverse().join("");
        // this.newComment=this.newComment.replace(this.newComment.substring(this.newComment.lastIndexOf('@')+1), name);
        target.value = revers;
        this.searchResult=[];
        target.focus();
    }
    searchNotifications(value): Array<string> {
        let result: Array<string>=[];
        let last = 0;
        let count = 0;
        while ((value.indexOf('@', last)!=-1)&&(count<10)) {
            count++;
            last = value.indexOf('@', last)+1;
            // console.log('last='+last);
            if (last!=-1) {
                let newResult = value.substring(last,  (value.indexOf(' ', last)==-1)?value.length:value.indexOf(' ', last));
                // console.log('newResult='+newResult);
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
        this.usersService.setNotification(data[i], this.currentCard, this.currentBoard).subscribe(data => {
            console.log(data);
        });
    }
}
