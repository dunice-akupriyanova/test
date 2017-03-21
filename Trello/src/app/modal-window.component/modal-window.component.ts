import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Card} from '../classes/classes';
import {List} from '../classes/classes';
import {Board} from '../classes/classes';
import { AppComponent } from '../app.component/app.component';
import {ModalWindowSetvice} from './modal-window.service';

@Component({
  selector: 'modal-window',
  templateUrl: './modal-window.component.html'
})
export class ModalWindowComponent {
  currentCard: Card;
  showModal = false;

  hideDetails(): void {
    this.modalWindowSetvice.closeModal(this.currentCard);
    this.showModal = false;
  }

  constructor(private modalWindowSetvice: ModalWindowSetvice) {
    modalWindowSetvice.open$.subscribe(data => {
        this.currentCard = <Card>data;
        this.showModal = true;
    });
  }
}
