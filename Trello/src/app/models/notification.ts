import { Card } from './card';

export class Notification {
    username: string;
    boardID: string;
    cards: Array<Card>
    constructor (username: string, boardID: string, cards: Array<Card> ) {
        this.username=username;
        this.boardID=boardID;
        this.cards=cards;
    }
}