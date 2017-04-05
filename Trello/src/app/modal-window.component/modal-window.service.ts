import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Card } from '../models/classes/card';


@Injectable()
export class ModalWindowService {  
    open = new Subject<any>();
    openModal(card, rights, board){
        console.log('openModal rights='+rights);
        this.open.next({card: card, rights: rights, board: board });
    }
}