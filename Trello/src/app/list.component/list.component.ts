import { Component, Input } from '@angular/core';
import { Card } from '../models/classes/card';
import { List } from '../models/classes/list';
import { Board } from '../models/classes/board';
import { ModalWindowService } from '../modal-window.component/modal-window.service';

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
    index: number;
    newCardName: string;
    constructor(private modalWindowService: ModalWindowService) { }
    removeList(list): void {
        this.currentBoard.lists.splice(this.currentBoard.lists.findIndex((element)=>element==list), 1);
    }
    addCard(): void {
        if (!this.newCardName) { return; }
        this.list.cards.push(new Card(this.newCardName, '', (new Date()).toLocaleString()));
        this.newCardName='';
    }
    showDetails(card): void {
        this.modalWindowService.openModal(card);
    }
}
