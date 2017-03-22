import { Component, Input } from '@angular/core';
import { AppComponent } from '../app.component/app.component';
import { Board } from '../models/classes/board';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls:['./main.component.css'],
  providers: [BackendService]
})
export class MainComponent {
    // constructor(private backendService: BackendService) { }
    // boards: Array<Board>=this.backendService.getBoards();
    boards: Array<Board>;
    currentBoard: Board;
  addBoard(newName): void {
    if (!newName) {return}
    this.boards.push(new Board(this.boards.length+1, newName, []));
    // this.newBoardName='';
    if (this.boards.length==1) {
      this.currentBoard=this.boards[0];
    }
  }
  changeBoard(board): void {
    if (board==this.currentBoard) {return}
    this.currentBoard=board;
  }
}
