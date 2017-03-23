import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Card } from '../models/classes/card';
import { ModalWindowService } from './modal-window.service';

@Component({
    selector: 'modal-window',
    templateUrl: './modal-window.component.html',
    styleUrls:['./modal-window.component.css']
})
export class ModalWindowComponent {
    currentCard: Card;
    constructor(private modalWindowService: ModalWindowService) {
        modalWindowService.open.subscribe(data => {
            this.currentCard = <Card>data;
        });
    }
    hideDetails(card: Card): void {
        this.currentCard=null;
    }
    changeDate(card: Card): void {
        card.date=(new Date()).toLocaleString();
    }
}
