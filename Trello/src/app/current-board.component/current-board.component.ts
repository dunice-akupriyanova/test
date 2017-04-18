import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { List } from '../models/list';
import { Board } from '../models/board';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BoardsService } from '../services/boards.service';
import { MainComponent } from '../main.component/main.component';
import { BoardService } from '../services/board.service';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { ModalWindowService } from '../modal-window.component/modal-window.service';
import { NotificationsService } from '../services/notifications.service';
import { NotificationWebsocketService } from '../services/notification-websocket.service';
import { User } from '../models/user';
import { JwtHelper } from 'angular2-jwt';

@Component({
    selector: 'current-board',
    templateUrl: './current-board.component.html',
    styleUrls: ['./current-board.component.css'],
    providers: []
})
export class CurrentBoardComponent {
    jwtHelper: JwtHelper = new JwtHelper();
    currentBoard: Board;
    newName: string;
    tokens: any = this.authService.getTokens();
    users: Array<User> = this.usersService.getUsers();
    user: User = UsersService.user;
    rights: String;
    allRights: Array<Object>;
    constructor(
        private boardsService: BoardsService,
        private boardService: BoardService,
        private authService: AuthService,
        private usersService: UsersService,
        private modalWindowService: ModalWindowService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private notificationWebsocketService: NotificationWebsocketService,
    ) {
        this.modalWindowService.refresh.subscribe(data => {
            this.currentBoard = data;
        });
        this.usersService.refresh.subscribe(data => {
            this.user = UsersService.user;
            this.route.params
                .subscribe((params) => {
                    this.initialization(params['id']);
                });
        });
    }
    ngOnInit() {
        this.route.params
            .subscribe((params)=> {
                if (this.boardsService.getBoardById(params['id'])) {
                    this.initialization(params['id']);
                }
            });
    }
    initialization(boardID): void {
        if (!BoardService.currentBoard) {
            BoardService.currentBoard = this.boardsService.getBoardById(boardID);
        }
        this.currentBoard = BoardService.currentBoard;
        if (!this.user) {
            return;
        }
        this.usersService.getRights(this.user.id, this.currentBoard.id).subscribe(
            data => {
                this.rights = data.rights;
                this.users = this.usersService.getUsers();
            });
    }
    addList(): void {
        if (!this.newName) { return; }
        this.currentBoard.lists.push(new List(this.newName, []));
        this.newName = '';
        this.updateBoard();
    }
    updateBoard(): void {
        this.boardService.updateBoard().subscribe(
            data => {},
            err => {
                this.authService.refreshTokens(this.tokens.refreshToken).subscribe(
                    data => {
                        this.authService.setTokens(data);
                        this.boardService.updateBoard().subscribe();
                    });
            });
    }
    setRights(event, user) {
        this.usersService.setRights(user.id, this.currentBoard.id, event.target.value).subscribe();
        this.notificationsService.setNotification('board', user.id, this.currentBoard).subscribe();
    }
}