import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Card } from '../models/classes/card';
import { ModalWindowService } from './modal-window.service';
import { BoardService } from '../services/board.service';

@Component({
    selector: 'modal-window',
    templateUrl: './modal-window.component.html',
    styleUrls:['./modal-window.component.css'],
    providers: [BoardService]
})
export class ModalWindowComponent {
    currentCard: Card;
    rights: string;
    constructor(
        private modalWindowService: ModalWindowService,
        private boardService: BoardService
        ) {
        modalWindowService.open.subscribe(data => {
            this.currentCard = <Card>data.card;
            this.rights = data.rights;
        });
    }
    hideDetails(card: Card): void {
        this.currentCard=null;
    }
    changeCard(card: Card): void {
        card.date=(new Date()).toLocaleString();
        this.boardService.updateBoard().subscribe();
    }
}
