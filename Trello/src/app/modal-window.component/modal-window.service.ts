import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Card } from '../models/classes/card';


@Injectable()
export class ModalWindowService {  
    open = new Subject<Card>();
    openModal(card){
        this.open.next(card);
    }
}