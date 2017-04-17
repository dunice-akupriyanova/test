import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Card } from '../models/card';


@Injectable()
export class ModalWindowService {  
    open = new Subject<any>();
    refresh = new Subject<any>();
    openModal(card, rights, board){
        this.open.next({card: card, rights: rights, board: board });
    }
    refreshBoard(board) {
        this.refresh.next(board);
    }
}