import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Card} from '../models/classes/card';
import {List} from '../models/classes/list';
import {Board} from '../models/classes/board';
import { AppComponent } from '../app.component/app.component';
import {ModalWindowService} from './modal-window.service';

@Component({
  selector: 'modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls:['./modal-window.component.css']
})
export class ModalWindowComponent {
  currentCard: Card;
  showModal = false;

  hideDetails(): void {
    this.modalWindowService.closeModal(this.currentCard);
    this.showModal = false;
  }

  constructor(private modalWindowService: ModalWindowService) {
    modalWindowService.open$.subscribe(data => {
        this.currentCard = <Card>data;
        this.showModal = true;
    });
  }
}
