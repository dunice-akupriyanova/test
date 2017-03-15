import { Component, Input } from '@angular/core';
import {Card} from '../classes/classes';
import {List} from '../classes/classes';
import { AppComponent } from '../app.component/app.component';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  @Input()
  list: List;
  @Input()
  lists: Array<List>;
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
    this.pull(this.lists, list);
  }
  newCardName: string;
  addCard(newCardName): void {
    if (!newCardName) {return}
    this.list.cards.push(new Card(newCardName, ''));
    this.newCardName='';
  }
}
