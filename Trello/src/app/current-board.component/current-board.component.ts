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
import { NotificationsService } from '../services/notifications.service';
import { User } from '../models/user';
import { JwtHelper } from 'angular2-jwt';

@Component({
    selector: 'current-board',
    templateUrl: './current-board.component.html',
    styleUrls: ['./current-board.component.css'],
    providers: [ BoardsService, BoardService, AuthService, UsersService, NotificationsService]
})
export class CurrentBoardComponent {
    jwtHelper: JwtHelper = new JwtHelper();
    currentBoard: Board;
    newName: string;
    tokens: any = this.authService.getTokens();    
    users: Array<User>=this.usersService.getUsers();
    user: string=this.usersService.getUser()?this.usersService.getUser():JSON.parse(localStorage.getItem('Username'));
    rights: String;
    allRights: Array<Object>;
    constructor(
        private boardsService: BoardsService,
        private boardService: BoardService,
        private authService: AuthService,
        private usersService: UsersService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService
    ) { }
    ngOnInit() {
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
        let id = JSON.parse(localStorage.getItem('UserID')?localStorage.getItem('UserID'):'');
        this.usersService.getRights(id, this.currentBoard.id).subscribe(
            data => {
                this.rights = data.rights;
                this.users=this.usersService.getUsers();
            }
        );
        this.usersService.getAllRights(this.currentBoard.id).subscribe(data => {
            // console.log(data); //!!!
        });
    }
    addList(): void {
        if (this.rights=='none'||this.rights=='read') { 
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
        this.usersService.setRights(user.id, this.currentBoard.id, event.target.value).subscribe(
                    d => {console.log(d);}
                );
                // console.log(user);
                console.log('this.currentBoard.id=', this.currentBoard.id);
        this.notificationsService.setNotification('board', user.username, this.currentBoard).subscribe(
            d => {console.log(d);}
        )
    }
}