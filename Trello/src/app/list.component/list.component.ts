import { Component, Input } from '@angular/core';
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
    board.count++;
    this.list.cards.push(new Card(board.count, newCardName, '', this.now.toLocaleString()));
    this.newCardName='';
  }
  showDetails(card, list): void {
    document.getElementById('window_overlay').classList.add('show');
    var detailsContent=document.getElementById('window_content');
    var containers=document.getElementsByClassName(card.id);
    var container=containers[0];
    var card_names=document.getElementsByClassName(card.name);
    var insert_name=card_names[0];
    if (insert_name){
      var insert_name_clone=insert_name.cloneNode(true);
    }
    var card_descriptions=document.getElementsByClassName(card.description);
    var insert_descriptions=card_descriptions[0];
    if (insert_descriptions) {
      var insert_descriptions_clone=insert_descriptions.cloneNode(true);
    }
    if (insert_name_clone){
      container.appendChild(insert_name_clone);
    }
    if (insert_descriptions_clone) {
      container.appendChild(insert_descriptions_clone);
    }
    console.log('before');
    for (let i=0; i<container.childNodes.length; i++) {
      console.log(container.childNodes[i]);
    }
    // document.body.appendChild(insert_name);
    // document.body.appendChild(insert_descriptions);
    detailsContent.innerHTML='';
    if (insert_name) {
      detailsContent.appendChild(insert_name);
    }
    if (insert_descriptions) {
      detailsContent.appendChild(insert_descriptions);
    }
    if (insert_name_clone){
      container.appendChild(insert_name_clone);
    }
    if (insert_descriptions_clone) {
      container.appendChild(insert_descriptions_clone);
    }
    console.log('after');
    console.log("clone");
    // console.log(insert_name_clone);
    // console.log(insert_descriptions_clone);
    for (let i=0; i<container.childNodes.length; i++) {
      console.log(container.childNodes[i]);
    }
  }
}
