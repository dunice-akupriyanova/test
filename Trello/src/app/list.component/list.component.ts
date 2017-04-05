import { Component, Input } from '@angular/core';
import { Card } from '../models/classes/card';
import { List } from '../models/classes/list';
import { Board } from '../models/classes/board';
import { ModalWindowService } from '../modal-window.component/modal-window.service';
import { BoardService } from '../services/board.service';

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    providers: [BoardService]
})
export class ListComponent {
    @Input()
    list: List;
    @Input()
    currentBoard: Board;
    @Input()
    index: number;
    @Input()
    rights: string;
    newCardName: string;
    constructor(
        private modalWindowService: ModalWindowService,
        private boardService: BoardService
    ) { }
    removeList(list): void {
        this.currentBoard.lists.splice(this.currentBoard.lists.findIndex((element) => element == list), 1);
        console.log('ok');
        this.boardService.updateBoard().subscribe(data=>{
            console.log('OK!');
        });
        console.log('ok2');
    }
    addCard(): void {
        if (!this.newCardName) { return; }
        this.list.cards.push(new Card(this.newCardName, '', (new Date()).toLocaleString(), []));
        this.newCardName = '';
        this.boardService.updateBoard().subscribe();
    }
    showDetails(card): void {
        this.modalWindowService.openModal(card, this.rights, this.currentBoard);
    }
    updateBoard(): void {
        console.log('ok');
        this.boardService.updateBoard().subscribe();
        console.log('ok2');
    }
}
