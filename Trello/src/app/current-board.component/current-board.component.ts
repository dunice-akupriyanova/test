import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { List } from '../models/classes/list';
import { Board } from '../models/classes/board';
import { BackendService } from '../services/backend.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BoardsService } from '../services/boards.service';
import { MainComponent } from '../main.component/main.component';
import { BoardService } from '../services/board.service';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { User } from '../models/classes/user';
import { JwtHelper } from 'angular2-jwt';

@Component({
    selector: 'current-board',
    templateUrl: './current-board.component.html',
    styleUrls: ['./current-board.component.css'],
    providers: [BackendService, BoardsService, BoardService, AuthService, UsersService]
})
export class CurrentBoardComponent {
    jwtHelper: JwtHelper = new JwtHelper();
    currentBoard: Board;
    newName: string;
    tokens: any = this.authService.getTokens();    
    // users: Array<User>=this.usersService.getUsers().splice(this.usersService.getUsers().findIndex((element) => element.username == this.user.username), 1);
    users: Array<User>=this.usersService.getUsers();
    user: any=this.usersService.getUser()?this.usersService.getUser():JSON.parse(localStorage.getItem('Username'));
    rights: String;
    constructor(
        private backendService: BackendService,
        private boardsService: BoardsService,
        private boardService: BoardService,
        private authService: AuthService,
        private usersService: UsersService,
        private route: ActivatedRoute
    ) { }
    ngOnInit() {
        this.route.params
            .subscribe((params) => {
                this.boardService.getBoardFromServer(params['id']).subscribe(
                    data => {
                        this.currentBoard = this.boardService.getBoard(data);
                        this.boardService.setCurrentBoard(this.currentBoard);
                        let id = JSON.parse(localStorage.getItem('UserID')?localStorage.getItem('UserID'):'');
                        this.usersService.getRights(id, this.currentBoard.id).subscribe(
                            data => {
                                this.rights = data.rights;
                                this.users=this.usersService.getUsers();
                                let index=this.users.findIndex((element) => element.username == this.user);
                                if (index!=-1) {
                                    this.users.splice(index, 1);
                                }
                            }
                        );
                    },
                    err => {
                        this.authService.refreshTokens(this.tokens.refreshToken).subscribe(
                            data => {
                                this.authService.setTokens(data);
                                this.boardService.getBoardFromServer(params['id']).subscribe(
                                    data => {
                                        this.currentBoard = this.boardService.getBoard(data);
                                        this.boardService.setCurrentBoard(this.currentBoard);
                                        let id = JSON.parse(localStorage.getItem('UserID')?localStorage.getItem('UserID'):'');
                                        this.usersService.getRights(id, this.currentBoard.id).subscribe(
                                            data => {
                                                this.rights = data.rights;
                                                this.users=this.usersService.getUsers();
                                                let index=this.users.findIndex((element) => element.username == this.user);
                                                if (index!=-1) {
                                                    this.users.splice(index, 1);
                                                }
                                            }
                                        );
                                    });
                            }
                        );
                    });
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
        console.log('ok');
        this.boardService.updateBoard().subscribe();
    }
    setRights(event, user) {
        this.usersService.setRights(user.id, this.currentBoard.id, event.target.value).subscribe(
                    d => {console.log(d);}
                );
    }
}
