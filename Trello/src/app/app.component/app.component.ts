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
  card1: Card=new Card(1, 'Card1', 'Description1', this.now.toLocaleString());
  card2: Card=new Card(2, 'Card2 Card2 Card2 Card2 Card2 Card2 Card2 Card2', 'Description2', this.now.toLocaleString());
  card3: Card=new Card(3, 'Card3', 'Description3', this.now.toLocaleString());
  card4: Card=new Card(4, 'Card4', 'Description4', this.now.toLocaleString());
  card5: Card=new Card(1, 'card5', 'Description5', this.now.toLocaleString());
  card6: Card=new Card(2, 'Card6', 'Description6', this.now.toLocaleString());
  card7: Card=new Card(3, 'Card7', 'Description7', this.now.toLocaleString());
  card8: Card=new Card(4, 'Card8', 'Description8', this.now.toLocaleString());
  card10: Card=new Card(5, ' Card10 Card10 Card8 Card8 Card8 Card8 Card8 Card8 Card8 Card8 Card8 Card8 Card8 ', 'Description8', this.now.toLocaleString());
  card9: Card=new Card(6, ' Card8 Card8 Card8 Card8 Card8 Card8 Card8 Card8 Card8 Card8 Card8 Card8 Card8 ', 'Description8', this.now.toLocaleString());
  list1: List=new List(0, 'list1', [this.card1, this.card2]);
  list2: List=new List(1, 'list2', [this.card3, this.card4, this.card9, this.card10]);
  list3: List=new List(0, 'list3', [this.card5, this.card6]);
  list4: List=new List(1, 'list4', [this.card7, this.card8]);
  board1: Board= new Board(6, 'Board1 Board1 Board1', [this.list1, this.list2]);
  board2: Board= new Board(4, 'Board2', [this.list3, this.list4]);
  boards: Array<Board>=[this.board1, this.board2];
  currentBoard: Board=this.boards[0];
  newName: string;
  currentCard: Card=new Card(0, '', '', '');  
  newBoardName: string;
  dragObject: any={};
  showCurrent(): void {
	  this.currentCard=ListComponent.currentCard;
  }
  addList(newName): void {
    if (!newName) {return}
    this.currentBoard.lists.push(new List(this.currentBoard.lists.length-1, newName, []));
    this.newName='';
    // $( function() {
      // $( ".sortable" ).sortable();
    //   console.log('ok');
    // } );
  }
  addBoard(newName): void {
    if (!newName) {return}
    this.boards.push(new Board(0, newName, []));
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

  onMouseMove(e) {
    console.log('move');
    if (!this.dragObject.elem) return; // элемент не зажат
    if (!this.dragObject.avatar) { // если перенос не начат...
      var moveX = e.pageX - this.dragObject.downX;
      var moveY = e.pageY - this.dragObject.downY;
      // если мышь передвинулась в нажатом состоянии недостаточно далеко
      if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
        return;
      }
      // начинаем перенос
      this.dragObject.avatar = this.createAvatar(e); // создать аватар
      if (!this.dragObject.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
        this.dragObject = {};
        return;
      }
      // аватар создан успешно
      // создать вспомогательные свойства shiftX/shiftY
      this.dragObject.shiftX = this.dragObject.downX - this.dragObject.coords.left;
      this.dragObject.shiftY = this.dragObject.downY - this.dragObject.coords.top;
      this.startDrag(e); // отобразить начало переноса
    }
    // отобразить перенос объекта при каждом движении мыши
    this.dragObject.avatar.style.left = e.pageX - this.dragObject.shiftX -35 + 'px';
    this.dragObject.avatar.style.top = e.pageY - this.dragObject.shiftY -35 + 'px';
    var point = document.elementFromPoint(e.clientX, e.clientY);
    var card = point.closest('.card');
    var container=document.createElement('div');
    container.classList.add('container');
    container.classList.add('droppable');
    if (card) {
      if (!card.classList.contains('container')) {
    console.log('card:');
    console.log(card);
        var containers= document.getElementsByClassName('container');
        for (let i=0; i<containers.length; i++){
          containers[i].remove();
        }
        var box1=card.getBoundingClientRect();
        console.log('box1.top'+box1.top);
        console.log('box1.bottom'+box1.bottom);
        console.log('e.pageY'+e.pageY);
        var cursor=pageYOffset+box1.top+(box1.bottom-box1.top)/2;
        console.log('cursor='+cursor);
        if (e.pageY<cursor) {
          console.log('before');
          card.parentNode.insertBefore(container, card);
        }
        if (e.pageY>cursor) {
          console.log('after');
          card.parentNode.insertBefore(container, card.nextSibling);
        }
      }
    }
    return false;
  }
  createAvatar(e) {

    // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
    var avatar = this.dragObject.elem;
    console.log(avatar);
    var old = {
      parent: avatar.parentNode,
      nextSibling: avatar.nextSibling,
      position: avatar.position || '',
      left: avatar.left || '',
      top: avatar.top || '',
      zIndex: avatar.zIndex || ''
    };
    console.log(old);
    // функция для отмены переноса
    avatar.rollback = function() {
      old.parent.insertBefore(avatar, old.nextSibling);
      avatar.style.position = old.position;
      avatar.style.left = old.left;
      avatar.style.top = old.top;
      avatar.style.zIndex = old.zIndex
    };
    avatar.classList.add('pointer');
    return avatar;
  }
  startDrag(e) {
    var avatar = this.dragObject.avatar;
    var cont=document.getElementById('content');
    // инициировать начало переноса
    cont.appendChild(avatar);
    avatar.style.zIndex = 1;
    avatar.style.position = 'absolute';
  }
  onMouseUp(e) {
    if (this.dragObject.avatar) { // если перенос идет
      this.finishDrag(e);
    }

    // перенос либо не начинался, либо завершился
    // в любом случае очистим "состояние переноса" dragObject
    this.dragObject = {};
    var containers= document.getElementsByClassName('container');
        for (let i=0; i<containers.length; i++){
          containers[i].remove();
        }
  }
  finishDrag(e) {
    var dropElem = this.findDroppable(e);
    console.log(dropElem);
    if (!dropElem) {
      this.onDragCancel(this.dragObject);
    } else {
      this.onDragEnd(this.dragObject, dropElem);
    }

  }
  findDroppable(event) {
    // спрячем переносимый элемент
    this.dragObject.avatar.hidden = true;

    // получить самый вложенный элемент под курсором мыши
    var elem = document.elementFromPoint(event.clientX, event.clientY);

    // показать переносимый элемент обратно
    this.dragObject.avatar.hidden = false;

    if (elem == null) {
      // такое возможно, если курсор мыши "вылетел" за границу окна
      return null;
    }

    return elem.closest('.droppable');
  }
  onDragCancel(dragObject) {
    // откат переноса
    this.dragObject.avatar.rollback();
    dragObject.elem.classList.remove('pointer');
  };
  onDragEnd(dragObject, dropElem) {
    console.log('onDragEnd');
    console.log(dropElem);
    console.log(dropElem.parentNode);
    console.log(dragObject.elem);
    var id;
    id=dropElem.nextSibling.id;
    console.log('id='+id);
    dragObject.elem.classList.remove('pointer');
    dropElem.parentNode.insertBefore(dragObject.elem, dropElem);
    //dragObject.elem=null;
  };
}
