import { Component } from '@angular/core';
import { Board } from '../models/classes/board';
import { BackendService } from '../services/backend.service';

@Component({
    selector: 'boards',
    templateUrl: './boards.component.html',
    styleUrls: ['./boards.component.css'],
    providers: [BackendService]
})
export class BoardsComponent {
    boards: Array<Board>=this.backendService.getBoards();
    newBoardName: string;
    constructor(private backendService: BackendService) { }
    addBoard(): void {
        if (!this.newBoardName) { return; }
        this.boards.push(new Board(+new Date(), this.newBoardName, []));
        this.newBoardName='';
    }
    removeBoard(board): void {
        this.boards.splice(this.boards.findIndex((element)=>element==board), 1);
    }
}
