import { Component, Input } from '@angular/core';
import { Card } from '../models/card';
import { List } from '../models/list';
import { Board } from '../models/board';
import { ModalWindowService } from '../modal-window.component/modal-window.service';
import { BoardService } from '../services/board.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    providers: []
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
        private boardService: BoardService,
        private authService: AuthService
    ) { }
    removeList(list): void {
        this.currentBoard.lists.splice(this.currentBoard.lists.findIndex((element) => element == list), 1);
        this.updateBoard();
    }
    addCard(): void {
        if (!this.newCardName) { return; }
        this.list.cards.push(new Card(+(new Date()), this.newCardName, '', (new Date()).toLocaleString(), [], []));
        this.newCardName = '';
        this.updateBoard();
    }
    showDetails(card): void {
        this.modalWindowService.openModal(card, this.rights, this.currentBoard);
    }
    updateBoard(): void {
        this.boardService.updateBoard().subscribe(data => {}, err => {});
    }
}
