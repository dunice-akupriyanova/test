import { Component, OnInit } from '@angular/core';
import { Board } from '../models/classes/board';
import { BackendService } from '../services/backend.service';
import { AuthService } from '../services/auth.service';
import { BoardsService } from '../services/boards.service';
import { BoardService } from '../services/board.service';

@Component({
    selector: 'boards',
    templateUrl: './boards.component.html',
    styleUrls: ['./boards.component.css'],
    providers: [BackendService, AuthService, BoardsService, BoardService]
})
export class BoardsComponent {
    answer: any;
    boards: Array<Board> = [];
    newBoardName: string;
    constructor(private backendService: BackendService, private authService: AuthService, private boardsService: BoardsService, private boardService: BoardService) { }
    addBoard(): void {
        if (!this.newBoardName) { return; }
        // this.boards.push(new Board(+new Date(), this.newBoardName, []));        
        this.boardsService.addBoard(this.newBoardName).subscribe(
            data => {
                console.log(data);
            });
        this.newBoardName = '';
        this.boardsService.getBoardsFromServer().subscribe(
            data => {
                this.answer = data;
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
                this.answer = data;
                this.boardsService.putBoards(data);
                this.boards = this.boardsService.getBoards();
            });
    }
}
