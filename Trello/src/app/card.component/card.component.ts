import { Component, Input } from '@angular/core';
import { Card } from '../models/card';
import { List } from '../models/list';
import { Board } from '../models/board';
import { BoardService } from '../services/board.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css'],
    providers: []
})
export class CardComponent {
    @Input()
    card: Card;
    @Input()
    list: List;
    @Input()
    rights: string;
    tokens: any = this.authService.getTokens();
    constructor(
        private boardService: BoardService,
        private authService: AuthService
    ) { }
    removeCard(list, card): void {
        this.list.cards.splice(this.list.cards.findIndex((element) => element == card), 1);
        this.boardService.updateBoard().subscribe(
            data => {},
            err => {
                this.authService.refreshTokens(this.tokens.refreshToken).subscribe(
                    data => {
                        this.authService.setTokens(data);
                        this.boardService.updateBoard().subscribe();
                    });
            });
    }
}
