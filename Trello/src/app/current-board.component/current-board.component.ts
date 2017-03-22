import 'rxjs/add/operator/switchMap';
import { Component, OnInit, HostBinding } from '@angular/core';
import {Card} from '../models/classes/card';
import {List} from '../models/classes/list';
import {Board} from '../models/classes/board';
import { BackendService } from '../services/backend.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'current-board',
  templateUrl: './current-board.component.html',
  styleUrls: ['./current-board.component.css'],
  providers: [BackendService]
})
export class CurrentBoardComponent {
    currentBoard: Board;
    constructor(
        private backendService: BackendService,
        private route: ActivatedRoute,
        private router: Router,
        ) { }
    boards: Array<Board>=this.backendService.getBoards();
    ngOnInit() {
    this.route.params
        .subscribe((params)=> {            
            this.currentBoard=this.backendService.getBoardByID(+params['id']);
        });
        
    }
    newName: string;
    newBoardName: string;
    addList(newName): void {
        if (!newName) {return}
        this.currentBoard.lists.push(new List(+new Date(), newName, []));
        this.newName='';
    }
    addBoard(newName): void {
        if (!newName) {return}
        this.boards.push(new Board(+new Date(), newName, []));
        this.newBoardName='';
        // if (this.boards.length==1) {
        //     this.currentBoard=this.boards[0];
        // }
    }
    showModal=true;
    onClose(event){
    this.showModal=false;
    }
}
