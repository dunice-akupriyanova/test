import { Component, Input, ElementRef } from '@angular/core';
import {Card} from '../classes/classes';
import {List} from '../classes/classes';
import {Board} from '../classes/classes';
import { AppComponent } from '../app.component/app.component';

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
  @Input()
  dragObject: any={};

  constructor(private elementRef: ElementRef) {}

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
  static currentCard: Card=new Card(0, '', '', '');
  newCardName: string;
  now=new Date();
  addCard(newCardName, board): void {
    this.now=new Date();
    if (!newCardName) {return}
    this.list.cards.push(new Card(this.list.cards.length+1, newCardName, '', this.now.toLocaleString()));
    board.cards++;
    this.newCardName='';
    // $(function() {
    //   console.log('ok');
    //   $('.draggable').draggable();
    //   console.log('ok2');
    // })
  }
  isOK(): void {
    console.log('0k');
  }
  isOK2(event): void {
    console.log('0k2');
    console.log(event.target);
  }
  isOK3(event): void {
    console.log('0k3');
    console.log(event.target);
  }
  showDetails(card, list): void {
    document.getElementById('window_overlay').classList.add('show');
	ListComponent.currentCard=card;
  }
  onMouseDown(e) {
    console.log('down');
    if (e.which != 1) return;
    var elem=e.target.closest('.draggable');
    if (!elem) return;
    if (elem) {
      this.dragObject.coords = this.getCoords(elem);
    }
    this.dragObject.elem = elem;

    // запомним, что элемент нажат на текущих координатах pageX/pageY
    this.dragObject.downX = e.pageX;
    this.dragObject.downY = e.pageY;
    return false;
  }
  getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }
}

