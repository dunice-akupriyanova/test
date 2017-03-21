import {Card} from './card';
export class List {
    id: number;
    name: string;
    cards: Array<Card>;
    constructor (id: number, name: string, cards: Card[]) {
        this.id=id;
        this.name=name;
        this.cards=cards;
    }
}