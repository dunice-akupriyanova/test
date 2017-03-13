import { Component, Input } from '@angular/core';

import { Node } from './node';
import { AppComponent } from './app.component';

@Component({
  selector: 'new-node',
  template: `
    <div *ngIf="node">
     <span *ngIf="(node.children)&&(node.open!=true)&&(node.children.length)" (click)="onSelect(node)" class="badge">+</span><span *ngIf="(node.children)&&(node.open==true)&&(node.children.length)" (click)="onSelect(node)" class="badge">-</span>
     {{node.name}}
     <button class="addNode" (click)="addLabel(node, newName)">+</button>
      <ul class="nodes" *ngIf="node.open==true">
          <li *ngFor="let h of node.children">
          <new-node [node]="h" [newName]="newName"></new-node>
        </ul>
    </div>
  `,
  styles: [`
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
    .nodes li:hover {
      color: #607D8B;
      background-color: #DDD;
      left: .1em;
    }
    .nodes .text {
      position: relative;
      top: -3px;
    }
    .badge {
      color: black;
      display: inline-block;
      font-size: small;
      background-color: gray;
      padding: 0.8em 0.7em 0 0.7em;
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
export class NewNodeComponent {
  @Input()
  node: Node;
  @Input()
  newName: String;
  clear(node: Node): void {
    node.open=false;
	if (node.children){
		for (let i=0; i<node.children.length; i++){
		  this.clear(node.children[i]);
		}
	}
  }
  onSelect(node: Node): void {
    if(node.open == true){
      this.clear(node);
    }
      else node.open=true;
  }
  addLabel(node: Node, newName: string): void {
    if (newName){
      if (newName.length!=0){
        node.children.push({name: newName, children:[], open: false});
      }
    }
  }
}


