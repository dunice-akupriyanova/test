import { Component, OnInit } from '@angular/core';
import { Board } from '../models/classes/board';
import { BackendService } from '../services/backend.service';
import { AuthService } from '../services/auth.service';
import { BoardsService } from '../services/boards.service';
import { BoardService } from '../services/board.service';
import { UsersService } from '../services/users.service';
import { JwtHelper } from 'angular2-jwt';

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
    constructor(
        private backendService: BackendService,
        private authService: AuthService,
        private boardsService: BoardsService,
        private usersService: UsersService,
        private boardService: BoardService
    ) { }
    addBoard(): void {
        if (!this.newBoardName) { return; }
        // this.boards.push(new Board(+new Date(), this.newBoardName, []));        
        this.boardsService.addBoard(this.newBoardName).subscribe(
            data => {
                // console.log('from add board');
                // console.log(data);
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
        this.boards.splice(this.boards.findIndex((element) => element == board), 1);
        this.boardService.deleteBoard(board.id).subscribe(
            data => { console.log(data); });
    }
    ngOnInit() {
        this.boardsService.getBoardsFromServer().subscribe(
            data => {
                this.boardsService.putBoards(data);
                this.boards = this.boardsService.getBoards();
            },
            err => {
                // console.log(err);
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
}
