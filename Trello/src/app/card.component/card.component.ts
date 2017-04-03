import { Component, Input } from '@angular/core';
import { Card } from '../models/classes/card';
import { List } from '../models/classes/list';
import { Board } from '../models/classes/board';
import { BoardService } from '../services/board.service';

@Component({
    selector: 'card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css'],
    providers: [BoardService]
})
export class CardComponent {
    @Input()
    card: Card;
    @Input()
    list: List;
    @Input()
    rights: string;
    constructor(
        private boardService: BoardService
    ) { }
    removeCard(list, card): void {
        this.list.cards.splice(this.list.cards.findIndex((element) => element == card), 1);
        this.boardService.updateBoard().subscribe();
    }
}
