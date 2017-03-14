import { Component, Input } from '@angular/core';

import { Node } from './node';
import { AppComponent } from './app.component';

@Component({
  selector: 'node',
  moduleId: module.id,
  templateUrl: './node.component.html',
  styleUrls: [ './style.css' ]
})
export class NodeComponent {
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
    if (!newName) { return }
      if (!newName.length) { return }
        node.children.push({name: newName, children:[], open: false});
  }
}


