import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { List } from '../models/classes/list';
import { Board } from '../models/classes/board';
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
    newName: string;
    boards: Array<Board>=this.backendService.getBoards();
    constructor(
        private backendService: BackendService,
        private route: ActivatedRoute
        ) { }
    ngOnInit() {
        this.route.params
            .subscribe((params)=> {            
                this.currentBoard=this.backendService.getBoardByID(+params['id']);
            });        
    }
    addList(): void {
        if (!this.newName) { return; }
        this.currentBoard.lists.push(new List(this.newName, []));
        this.newName='';
    }
}
