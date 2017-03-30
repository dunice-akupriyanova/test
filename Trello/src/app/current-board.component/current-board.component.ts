import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { List } from '../models/classes/list';
import { Board } from '../models/classes/board';
import { BackendService } from '../services/backend.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BoardsService } from '../services/boards.service';
import { BoardService } from '../services/board.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'current-board',
    templateUrl: './current-board.component.html',
    styleUrls: ['./current-board.component.css'],
    providers: [BackendService, BoardsService, BoardService, AuthService]
})
export class CurrentBoardComponent {
    currentBoard: Board;
    newName: string;
    constructor(
        private backendService: BackendService,
        private boardsService: BoardsService,
        private boardService: BoardService,
        private authService: AuthService,
        private route: ActivatedRoute
    ) { }
    ngOnInit() {
        this.route.params
            .subscribe((params) => {
                this.boardService.getBoardFromServer(params['id']).subscribe(
                    data => {
                        this.currentBoard = this.boardService.getBoard(data);
                        this.boardService.setCurrentBoard(this.currentBoard);
                    });
            });

    }
    addList(): void {
        if (!this.newName) { return; }
        this.currentBoard.lists.push(new List(this.newName, []));
        this.newName = '';
        this.updateBoard();
    }
    updateBoard(): void {
        this.boardService.updateBoard().subscribe();
    }
}
