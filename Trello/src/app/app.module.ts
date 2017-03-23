import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DndModule } from 'ng2-dnd';
import { Router } from '@angular/router';

import { AppComponent } from './app.component/app.component';
import { ListComponent } from './list.component/list.component';
import { CardComponent } from './card.component/card.component';
import { ModalWindowComponent } from './modal-window.component/modal-window.component';
import { ModalWindowService } from './modal-window.component/modal-window.service';
import { AppRoutingModule }     from './routing/app-routing.module'
import { LoginComponent } from './login.component/login.component';
import { MainComponent } from './main.component/main.component';
import { BoardsComponent } from './boards.component/boards.component';
import { CurrentBoardComponent } from './current-board.component/current-board.component';


@NgModule({
    declarations: [
        AppComponent,
        ListComponent,
        CardComponent,
        ModalWindowComponent,
        LoginComponent,
        MainComponent,
        BoardsComponent,
        CurrentBoardComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        DndModule.forRoot(),
        AppRoutingModule
    ],
    providers: [ModalWindowService],
    bootstrap: [AppComponent]
})
export class AppModule { 
    constructor(router: Router) {}
}
