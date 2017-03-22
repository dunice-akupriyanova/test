import { Component, Input } from '@angular/core';
import {Card} from '../models/classes/card';
import {List} from '../models/classes/list';
import {Board} from '../models/classes/board';
import { AppComponent } from '../app.component/app.component';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
  providers: [BackendService]
})
export class BoardsComponent {
    currentBoard: Board;
    constructor(private backendService: BackendService) { }
    boards: Array<Board>=this.backendService.getBoards();
    newBoardName: string;
    addBoard(newName): void {
        if (!newName) {return}
        this.boards.push(new Board(+new Date(), newName, []));
        this.newBoardName='';
    }
    pull(array, target) {
        var args = [array, target],
            argsIndex = 0,
            argsLength = args.length,
            length = array ? array.length : 0;

        while (++argsIndex < argsLength) {
        var index = -1,
            value = args[argsIndex];
        while (++index < length) {
            if (array[index] === value) {
            array.splice(index--, 1);
            length--;
            }
        }
        }
        return array;
    }
    removeBoard(board): void {
        this.pull(this.boards, board);
        if (board==this.currentBoard) {
            this.currentBoard=this.boards[0];
        }
    }
}
