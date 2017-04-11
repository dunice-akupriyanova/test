import {Card} from './card';
export class List {
    name: string;
    cards: Array<Card>;
    constructor (name: string, cards: Card[]) {
        this.name=name;
        this.cards=cards;
    }
}