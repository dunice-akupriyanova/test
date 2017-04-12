import { Card } from './card';

export class Notification {
    type: string;
    username: string;
    boardID: string;
    cards: Array<Card>
    constructor (type: string, username: string, boardID: string, cards: Array<Card> ) {
        this.type = type;
        this.username = username;
        this.boardID = boardID;
        this.cards = cards;
    }
}