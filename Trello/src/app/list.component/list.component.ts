import { Component, Input } from '@angular/core';
import {Card} from '../models/classes';
import {List} from '../models/classes';
import {Board} from '../models/classes';
import { AppComponent } from '../app.component/app.component';
import {ModalWindowSetvice} from '../modal-window.component/modal-window.service';

@Component({
  selector: 'list',
  templateUrl: './list.component.html'
})
export class ListComponent {
  @Input()
  list: List;
  @Input()
  currentBoard: Board;
  @Input()
  j: number;
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
  removeList(list): void {
    this.pull(this.currentBoard.lists, list);
  }
  newCardName: string;
  now=new Date();
  addCard(newCardName, board): void {
    this.now=new Date();
    if (!newCardName) {return}
    this.list.cards.push(new Card(newCardName, '', this.now.toLocaleString()));
    this.newCardName='';
  }
  constructor(private modalWindowSetvice: ModalWindowSetvice) {
    modalWindowSetvice.close$.subscribe();
  }
  showDetails(card): void {
    this.modalWindowSetvice.openModal(card);
  }
}
