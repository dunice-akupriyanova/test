import { Component, Input } from '@angular/core';
import {Card} from '../models/classes/card';
import {List} from '../models/classes/list';
import {Board} from '../models/classes/board';
import { AppComponent } from '../app.component/app.component';
import {ModalWindowService} from '../modal-window.component/modal-window.service';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
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
  constructor(private modalWindowService: ModalWindowService) {
    modalWindowService.close$.subscribe();
  }
  showDetails(card): void {
    this.modalWindowService.openModal(card);
  }
}
