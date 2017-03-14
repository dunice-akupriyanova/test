import { Component, Input } from '@angular/core';
import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
 

import { Node } from './node';

const NODES: Node[] = [];

@Component({
  selector: 'my-app',
  moduleId: module.id,
  templateUrl: './app.component.html',
  styleUrls: [ './style.css' ]
})
export class AppComponent {
  title = 'TreeView';
  newName: string='';
  nodes = NODES;
  @Input()
  add(name: string, nodes: Node[]): void {
      nodes.push({name: name, children: [], open: false});
    }    
  }

