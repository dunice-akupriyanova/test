import { Component, Input } from '@angular/core';
import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
 

import { Node } from './node';

const NODES: Node[] = [];

@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <form>
        <div>
          <label>Node:</label> <input name="newName" [(ngModel)]="newName" #nodeName />
        </div>
        <div>
            <input type="submit" value="Add!" class="button_add" (click)="add(nodeName.value, nodes); nodeName.value=''">
        </div>
    </form>
    <ul class="nodes">
      <li *ngFor="let node of nodes">
        <new-node [node]="node" [newName]="nodeName.value"></new-node>
      </li>
    </ul>
  `,
  styles: [`
    .selected {
      background-color: #CFD8DC !important;
      color: white;
    }
    .nodes {
      list-style-type: none;
      padding: 0;
      width: 15em;
    }
    .nodes li {
      cursor: pointer;
      position: relative;
      left: 0;
      background-color: #EEE;
      margin: .5em;
      padding: .3em 0;
      border-radius: 4px;
    }
    .nodes li.selected:hover {
      background-color: #BBD8DC !important;
      color: white;
    }
    .nodes li:hover {
      color: #607D8B;
      background-color: #DDD;
      left: .1em;
    }
    .nodes .text {
      position: relative;
      top: -3px;
    }
    .nodes .badge {
      display: inline-block;
      font-size: small;
      color: white;
      padding: 0.8em 0.7em 0 0.7em;
      background-color: #607D8B;
      line-height: 1em;
      position: relative;
      left: -1px;
      top: -4px;
      height: 1.8em;
      margin-right: .8em;
      border-radius: 4px 0 0 4px;
    }
  `]
})
export class AppComponent {
  title = 'TreeView';
  newName: string='';
  nodes = NODES;
  @Input()
  add(n: string, nodes: Node[]): void {
      nodes.push({name: n, children: [], open: false});
    }    
  }

