import { Injectable } from '@angular/core';

import { Card } from '../models/classes/card';
import { List } from '../models/classes/list';
import { Board } from '../models/classes/board';


@Injectable()
export class BackendService {
    now=new Date();
    static boards: Array<Board>=[
        new Board(1, 'Board1 Board1 Board1', [
            new List(1, 'List1', [
                new Card('Card1', 'Description1', (new Date()).toLocaleString()),
                new Card('Card2 Card2 Card2 Card2 Card2 Card2 Card2 Card2 Card2', 'Description2', (new Date()).toLocaleString()),
                new Card('Card3', 'Description3', (new Date()).toLocaleString())
                ]),
            new List(2, 'List2', [
                new Card('Card4', 'Description4', (new Date()).toLocaleString()),
                new Card('Card5', 'Description5', (new Date()).toLocaleString()),
                new Card('Card6', 'Description6', (new Date()).toLocaleString())
                ]),
        ]),
        new Board(2, 'Board2', [])
    ];
    static currentBoard;
    getBoards(): Array<Board>{
        return BackendService.boards;
    }
    getBoardByID(id: number|string){
        let getBoard = function(element, index, array) {
            return element.id==+id;
        }
        return BackendService.boards.find(getBoard);
    }
}