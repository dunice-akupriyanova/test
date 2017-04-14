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
    providers: [UsersService]
})
export class CurrentBoardComponent {
    jwtHelper: JwtHelper = new JwtHelper();
    currentBoard: Board;
    newName: string;
    tokens: any = this.authService.getTokens();
    users: Array<User> = this.usersService.getUsers();
    user: string = this.usersService.getUser() ? this.usersService.getUser() : JSON.parse(localStorage.getItem('Username'));
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
        this.modalWindowService.refresh.subscribe(data=> {
            // console.log('data=', data);
            this.currentBoard = data;
        });
    }
    ngOnInit() {
        // this.notificationWebsocketService.notifications.subscribe(msg => {
        //     if (<string>msg.title != 'updated') {
        //         return;
        //     }
        //     console.log("current board, Response from websocket: ", msg);
        //     let boardID = msg.payload._id;
            
        //     this.boardsService.getBoardsFromServer().subscribe(
        //         data => {
        //             // this.boardsService.putBoards(data);
        //             if (!BoardService.currentBoard || BoardService.currentBoard.id != boardID) { return; }

        //             // BoardService.currentBoard = this.boardsService.getBoardById(boardID);
        //             console.log('this.current');
        //             this.currentBoard = BoardService.currentBoard;
        //             // console.log('BoardService.currentBoard=', BoardService.currentBoard);                                   
        //         },
        //         err => {
        //             this.authService.refreshTokens(this.tokens.refreshToken).subscribe(
        //                 data => {
        //                     this.authService.setTokens(data);
        //                     this.boardsService.getBoardsFromServer().subscribe(
        //                         data => {
        //                             // this.boardsService.putBoards(data);
        //                             if (!BoardService.currentBoard || BoardService.currentBoard.id != boardID) { return; }
        //                             // BoardService.currentBoard = this.boardsService.getBoardById(boardID);
        //                             console.log('this.current');
        //                             this.currentBoard = BoardService.currentBoard;                                        
        //                         });
        //                 }
        //             );
        //         });
        // });
        this.route.params  
            .subscribe((params) => {
                this.boardsService.getBoardsFromServer().subscribe(
                    data => {
                        this.boardsService.putBoards(data);
                        this.initialization(params['id']);
                    },
                    err => {
                        this.authService.refreshTokens(this.tokens.refreshToken).subscribe(
                            data => {
                                this.authService.setTokens(data);
                                this.boardsService.getBoardsFromServer().subscribe(
                                    data => {
                                        this.boardsService.putBoards(data);
                                        this.initialization(params['id']);
                                    });
                            }
                        );
                    });
            });
    }
    initialization(boardID): void {
        if (!BoardService.currentBoard) {
            BoardService.currentBoard = this.boardsService.getBoardById(boardID);
        }
        this.currentBoard = BoardService.currentBoard;
        // console.log('BoardService.currentBoard=', BoardService.currentBoard);
        let id = JSON.parse(localStorage.getItem('UserID') ? localStorage.getItem('UserID') : '');
        this.usersService.getRights(id, this.currentBoard.id).subscribe(
            data => {
                this.rights = data.rights;
                this.users = this.usersService.getUsers();
            }
        );
        this.usersService.getAllRights(this.currentBoard.id).subscribe(data => {
            // console.log(data); //!!!
        });
    }
    addList(): void {
        if (this.rights == 'none' || this.rights == 'read') {
            this.newName = '';
            alert('No access rights!');
            return
        }
        if (!this.newName) { return; }
        this.currentBoard.lists.push(new List(this.newName, []));
        this.newName = '';
        this.updateBoard();
    }
    updateBoard(): void {
        this.boardService.updateBoard().subscribe(
            data => {
                // console.log(data);
            },
            err => {
                this.authService.refreshTokens(this.tokens.refreshToken).subscribe(
                    data => {
                        this.authService.setTokens(data);
                        this.boardService.updateBoard().subscribe();
                    });
            });
    }
    setRights(event, user) {
        // console.log(user);
        this.usersService.setRights(user.id, this.currentBoard.id, event.target.value).subscribe(
            d => { console.log(d); }
        );
        // console.log(user);
        console.log('this.currentBoard.id=', this.currentBoard.id);
        this.notificationsService.setNotification('board', user.id, this.currentBoard).subscribe(
            d => { console.log(d); }
        )
    }
    check(): void {
        console.log('this.currentBoard=', this.currentBoard);
    }
}