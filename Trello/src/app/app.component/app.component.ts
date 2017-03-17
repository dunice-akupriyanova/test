import { Component } from '@angular/core';
import {Card} from '../classes/classes';
import {List} from '../classes/classes';
import {Board} from '../classes/classes';
import {ListComponent} from '../list.component/list.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  now=new Date();
  card1: Card=new Card('Card1', 'Description1', this.now.toLocaleString());
  card2: Card=new Card('Card2 Card2 Card2 Card2 Card2 Card2 Card2 Card2', 'Description2', this.now.toLocaleString());
  card3: Card=new Card('Card3', 'Description3', this.now.toLocaleString());
  card4: Card=new Card('Card4', 'Description4', this.now.toLocaleString());
  card5: Card=new Card('card5', 'Description5', this.now.toLocaleString());
  card6: Card=new Card('Card6', 'Description6', this.now.toLocaleString());
  card7: Card=new Card('Card7', 'Description7', this.now.toLocaleString());
  card8: Card=new Card('Card8', 'Description8', this.now.toLocaleString());
  list1: List=new List(1, 'list1', [this.card1, this.card2]);
  list2: List=new List(2, 'list2', [this.card3, this.card4]);
  list3: List=new List(1, 'list3', [this.card5, this.card6]);
  list4: List=new List(2, 'list4', [this.card7, this.card8]);
  board1: Board= new Board('Board1 Board1 Board1', [this.list1, this.list2]);
  board2: Board= new Board('Board2', [this.list3, this.list4]);
  boards: Array<Board>=[this.board1, this.board2];
  currentBoard: Board=this.boards[0];
  newName: string;
  currentCard: Card=new Card('', '', '');  
  newBoardName: string;
  showCurrent(): void {
	  this.currentCard=ListComponent.currentCard;
  }
  addList(newName): void {
    if (!newName) {return}
    this.currentBoard.lists.push(new List(this.currentBoard.lists.length, newName, []));
    this.newName='';
    // $( function() {
      // $( ".sortable" ).sortable();
    //   console.log('ok');
    // } );
  }
  addBoard(newName): void {
    if (!newName) {return}
    this.boards.push(new Board(newName, []));
    this.newBoardName='';
    if (this.boards.length==1) {
      this.currentBoard=this.boards[0];
    }
  }
  changeBoard(board): void {
    if (board==this.currentBoard) {return}
    this.currentBoard=board;
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
  hideDetails(): void {
    let details=document.getElementById('window_overlay');
    details.classList.remove('show');

  }
}
