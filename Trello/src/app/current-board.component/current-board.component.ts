import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { List } from '../models/classes/list';
import { Board } from '../models/classes/board';
import { BackendService } from '../services/backend.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BoardsService } from '../services/boards.service';
import { BoardService } from '../services/board.service';

@Component({
  selector: 'current-board',
  templateUrl: './current-board.component.html',
  styleUrls: ['./current-board.component.css'],
  providers: [BackendService, BoardsService, BoardService]
})
export class CurrentBoardComponent {
    currentBoard: Board;
    newName: string;
    boards: Array<Board>=this.backendService.getBoards();
    constructor(
        private backendService: BackendService,
        private boardsService : BoardsService,
        private boardService : BoardService,
        private route: ActivatedRoute
        ) { }
    ngOnInit() { 
        console.log('1');   
        this.boardsService.getBoardsFromServer().subscribe(
            data => {
                console.log('2');  
                this.boardsService.putBoards(data);
                this.boards = this.boardsService.getBoards();
            });
        console.log('3');  
        this.route.params
            .subscribe((params)=> {
                console.log('4');
                let foundBoard=this.boardService.getBoardByID(params['id']);
                if (foundBoard) {
                    console.log('found');
                    this.currentBoard=foundBoard;
                    this.boardsService.setCurrentBoard(foundBoard);
                } else {
                    console.log('not found');
                    this.currentBoard=this.boardsService.getCurrentBoard();
                }
            });
        console.log('5');  
    }
    addList(): void {
        if (!this.newName) { return; }
        this.currentBoard.lists.push(new List(this.newName, []));
        this.newName='';
    }
}
