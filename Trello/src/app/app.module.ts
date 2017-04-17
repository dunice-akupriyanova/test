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
import { AppRoutingModule } from './routing/app-routing.module'
import { LoginComponent } from './login.component/login.component';
import { MainComponent } from './main.component/main.component';
import { BoardsComponent } from './boards.component/boards.component';
import { CurrentBoardComponent } from './current-board.component/current-board.component';
import { LoggedOutComponent } from './logged-out.component/logged-out.component';
import { SignupComponent } from './signup.component/signup.component';
import { NotificationWebsocketService } from './services/notification-websocket.service';
import { NotificationsService } from './services/notifications.service';
import { BoardsService } from './services/boards.service';
import { BoardService } from './services/board.service';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { WebsocketService } from './services/websocket.service'

@NgModule({
    declarations: [
        AppComponent,
        ListComponent,
        CardComponent,
        ModalWindowComponent,
        LoginComponent,
        LoggedOutComponent,
        SignupComponent,
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
    providers: [
        ModalWindowService,
        NotificationWebsocketService,
        NotificationsService,
        BoardsService,
        BoardService,
        AuthService,
        WebsocketService,
        UsersService
        ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(router: Router) { }
}
