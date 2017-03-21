import { Component, Input } from '@angular/core';
import { AppComponent } from '../app.component/app.component';

export class Card {
    id: number;
    name: string;
    description: string;
    date: string;
    constructor (id: number, name: string, description: string, date: string) {
        this.id=id;
        this.name=name;
        this.description=description;
        this.date=date;
    }
}
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
export class Board {
    cards: number;
    name: string;
    lists: Array<List>;
    constructor (cards: number, name: string, lists: List[]) {
        this.cards=cards;
        this.name=name;
        this.lists=lists;
    }
}