import { Component, OnInit } from '@angular/core';
import { Board } from '../models/board';
import { AuthService } from '../services/auth.service';
import { BoardsService } from '../services/boards.service';
import { BoardService } from '../services/board.service';
import { UsersService } from '../services/users.service';
import { NotificationWebsocketService } from '../services/notification-websocket.service';
import { JwtHelper } from 'angular2-jwt';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
    selector: 'boards',
    templateUrl: './boards.component.html',
    styleUrls: ['./boards.component.css'],
    providers: []
})
export class BoardsComponent {
    boards: Array<Board> = [];
    newBoardName: string;
    user: User = UsersService.user;
    jwtHelper: JwtHelper = new JwtHelper();
    rights: string;
    constructor(
        private authService: AuthService,
        private boardsService: BoardsService,
        private usersService: UsersService,
        private boardService: BoardService,
        private notificationWebsocketService: NotificationWebsocketService,
        private router: Router
    ) {
        this.notificationWebsocketService.notifications.subscribe(msg => {
            if (<string>msg.title != 'boardsAreUpdated') {
                return;
            }
            this.boardsService.getBoardsFromServer().subscribe(data => {
                this.boards = this.boardsService.getBoards();
            }, err => { });
            this.boardsService.refresh.subscribe(() => {
                this.boards = this.boardsService.getBoards();
            });
        });
    }
    addBoard(): void {
        if (!this.newBoardName) { return; }

        this.boardsService.addBoard(this.newBoardName).subscribe(data => {
            this.add(data);
        }, err => {});
        this.boardsService.add.subscribe(data => {
            this.add(data);
        });
    }
    add(data): void {
        this.newBoardName = '';
        this.usersService.setRights(this.jwtHelper.decodeToken(AuthService.tokens.accessToken).id, data._id, 'owner').subscribe();
        this.boardsService.getBoardsFromServer().subscribe(data => {
            this.boards = this.boardsService.getBoards();
        }, err => { });
        this.boardsService.refresh.subscribe(data => {
            this.boards = this.boardsService.getBoards();
        });
    }
    removeBoard(board): void {
        this.usersService.getRights(this.usersService.getUser().id, board.id).subscribe(
            rights => {
                // if (rights.rights != 'owner') {
                //     alert('No access rights!');
                //     return;
                // }
                this.boards.splice(this.boards.findIndex((element) => element == board), 1);
                this.boardService.deleteBoard(board.id).subscribe(data => {}, err => {});
            });
    }
    ngOnInit() {
        this.boards = BoardsService.boards;
        BoardService.currentBoard = null;
        this.usersService.refresh.subscribe(data => {
            this.boards = this.boardsService.getBoards();
        });
    }
    chooseBoard(id): void {
        this.user = this.usersService.getUser();
        this.usersService.getRights(this.user.id, id).subscribe(
            rights => {
                if (rights.rights == 'none') {
                    alert('No access rights!');
                    return;
                }
                BoardService.currentBoard = this.boardsService.getBoardById(id);
                this.router.navigate([`/board/${id}`]);
            });
    }
}
