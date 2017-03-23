import { Component, Input } from '@angular/core';
import { Card } from '../models/classes/card';
import { List } from '../models/classes/list';

@Component({
    selector: 'card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input()
  card: Card;
  @Input()
  list: List;
  removeCard(list, card): void {
      this.list.cards.splice(this.list.cards.findIndex((element)=>element==card), 1);
  }
}
