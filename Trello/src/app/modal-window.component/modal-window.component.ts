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
    showModal = false;

    hideDetails(card: Card): void {
        this.showModal = false;
    }
    changeDate(card: Card): void {
        card.date=(new Date()).toLocaleString();
    }
    constructor(private modalWindowService: ModalWindowService) {
        modalWindowService.open.subscribe(data => {
            this.currentCard = <Card>data;
            this.showModal = true;
        });
    }
}
