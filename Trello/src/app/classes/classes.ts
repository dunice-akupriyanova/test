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
    name: string;
    cards: Array<Card>;
    constructor (name: string, cards: Card[]) {
        this.name=name;
        this.cards=cards;
    }
}
export class Board {
    count: number;
    name: string;
    lists: Array<List>;
    constructor (count: number, name: string, lists: List[]) {
        this.count=count;
        this.name=name;
        this.lists=lists;
    }
}