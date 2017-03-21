import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {DndModule} from 'ng2-dnd';

import { AppComponent } from './app.component/app.component';
import { ListComponent } from './list.component/list.component';
import { CardComponent } from './card.component/card.component';
import {ModalWindowComponent} from './modal-window.component/modal-window.component';
import {ModalWindowService} from './modal-window.component/modal-window.service';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    CardComponent,
    ModalWindowComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DndModule.forRoot()
  ],
  providers: [ModalWindowService],
  bootstrap: [AppComponent]
})
export class AppModule { }
