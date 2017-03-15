import { Component } from '@angular/core';
import {Card} from '../classes/classes';
import {List} from '../classes/classes';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  card1: Card=new Card('Card1', 'Description1');
  card2: Card=new Card('Card2 Card2 Card2 Card2 Card2 Card2 Card2 Card2', 'Description2');
  card3: Card=new Card('Card3', 'Description3');
  card4: Card=new Card('Card4', 'Description4');
  list1: List=new List('list1', [this.card1, this.card2]);
  list2: List=new List('list2', [this.card3, this.card4]);
  lists= [this.list1, this.list2];
  newName: string;
  addList(newName): void {
    if (!newName) {return}
    this.lists.push(new List(newName, []));
    this.newName='';
  }
}
