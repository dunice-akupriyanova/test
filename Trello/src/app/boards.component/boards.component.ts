import { Component, OnInit } from '@angular/core';
import { Board } from '../models/classes/board';
import { BackendService } from '../services/backend.service';
import { AuthService } from '../services/auth.service';
import { BoardsService } from '../services/boards.service';
import { BoardService } from '../services/board.service';
import { UsersService } from '../services/users.service';
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';

@Component({
    selector: 'boards',
    templateUrl: './boards.component.html',
    styleUrls: ['./boards.component.css'],
    providers: [BackendService, AuthService, BoardsService, BoardService, UsersService]
})
export class BoardsComponent {
    boards: Array<Board> = [];
    newBoardName: string;
    jwtHelper: JwtHelper = new JwtHelper();
    tokens: any = this.authService.getTokens();
    rights: string;
    constructor(
        private backendService: BackendService,
        private authService: AuthService,
        private boardsService: BoardsService,
        private usersService: UsersService,
        private boardService: BoardService,
        private router: Router
    ) { }
    addBoard(): void {
        if (!this.newBoardName) { return; }     
        this.boardsService.addBoard(this.newBoardName).subscribe(
            data => {
                this.usersService.setRights(this.jwtHelper.decodeToken(this.tokens.accessToken).id, data._id, 'owner').subscribe(
                    d => {console.log(d);}
                );

            });
        this.newBoardName = '';
        this.boardsService.getBoardsFromServer().subscribe(
            data => {
                this.boardsService.putBoards(data);
                this.boards = this.boardsService.getBoards();                
            });
    }
    removeBoard(board): void {
        this.usersService.getRights(UsersService.user.id, board.id).subscribe(
            rights => {
                console.log('got rights='+rights.rights);
                if (rights.rights!='owner') {
                   alert('No access rights!');
                   return;
                }
                this.boards.splice(this.boards.findIndex((element) => element == board), 1);
                this.boardService.deleteBoard(board.id).subscribe(
                    data => { console.log(data); });
                }); 
    }
    ngOnInit() {
        this.boardsService.getBoardsFromServer().subscribe(
            data => {
                this.boardsService.putBoards(data);
                this.boards = this.boardsService.getBoards();
            },
            err => {
                this.authService.refreshTokens(this.tokens.refreshToken).subscribe(
                    data => {
                        this.authService.setTokens(data);
                        this.boardsService.getBoardsFromServer().subscribe(
                            data => {
                                this.boardsService.putBoards(data);
                                this.boards = this.boardsService.getBoards();
                            });
                    }
                );
            });        
    }
    chooseBoard(id): void {
        this.usersService.getRights(UsersService.user.id, id).subscribe(
            rights => {
                console.log('got rights='+rights.rights);
                if (rights.rights!='none') {
                   this.router.navigate([`/board/${id}`]);
                } else { alert('No access rights!'); }
            }
        );        
    }
}
