import { Component, Input } from '@angular/core';
import { AppComponent } from '../app.component/app.component';

export class Card {
    name: string;
    description: string;
    constructor (name: string, description: string) {
        this.name=name;
        this.description=description;
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