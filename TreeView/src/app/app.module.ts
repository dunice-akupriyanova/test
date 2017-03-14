import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent }  from './app.component/app.component';
import { NodeComponent } from './node.component/node.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    NodeComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
