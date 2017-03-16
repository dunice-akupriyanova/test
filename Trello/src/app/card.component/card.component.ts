import { Component, Input } from '@angular/core';
import {Card} from '../classes/classes';
import {List} from '../classes/classes';
import {Board} from '../classes/classes';
import { AppComponent } from '../app.component/app.component';

@Component({
  selector: 'card',
  templateUrl: './card.component.html'
})
export class CardComponent {
  @Input()
  card: Card;
  @Input()
  list: List;
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
  removeCard(list, card): void {
    this.pull(list.cards, card);
  }
}
