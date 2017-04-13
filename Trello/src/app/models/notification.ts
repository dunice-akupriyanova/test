import { Card } from './card';

export class Notification {
    type: string;
    userID: string;
    boardID: string;
    cards: Array<Card>
    constructor (type: string, userID: string, boardID: string, cards: Array<Card> ) {
        this.type = type;
        this.userID = userID;
        this.boardID = boardID;
        this.cards = cards;
    }
}