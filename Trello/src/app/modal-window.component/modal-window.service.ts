import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Card } from '../models/classes/card';


@Injectable()
export class ModalWindowService {  
    private open = new Subject<Card>();
    private close = new Subject<Card>();
    open$ = this.open.asObservable();
    close$ = this.close.asObservable();
    openModal(card){
        this.open.next(card);
    }  
    closeModal(card){
        this.close.next(card);
    }
}