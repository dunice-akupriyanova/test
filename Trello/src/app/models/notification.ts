import { Card } from './card';

export class Notification {
    type: string;
    userID: string;
    boardID: string;
    cardID: string;
    overlooked: boolean;
    constructor(type: string, userID: string, boardID: string, cardID: string, overlooked: boolean) {
        this.type = type;
        this.userID = userID;
        this.boardID = boardID;
        this.cardID = cardID;
        this.overlooked = overlooked;
    }
}