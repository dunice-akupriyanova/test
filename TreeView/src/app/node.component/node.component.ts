import { Component, Input } from '@angular/core';
import { AppComponent } from '../app.component/app.component';

@Component({
  selector: 'node',
  moduleId: module.id,
  templateUrl: './node.component.html',
  styleUrls: [ '../style.css' ]
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
    if(node.open){
      this.clear(node);
    } else node.open=true;
  }
  addNode(node: Node, newName: string): void {
    if (!newName) { return }
    if (!newName.length) { return }
    node.children.push(new Node(newName, [], false));
  }
}
export class Node {
  name: string;
  children: Array<Node>;
  open: Boolean;
  constructor (name: string, children: Node[], open: Boolean) {
    this.name=name;
    this.children=children;
    this.open=open;
  }
}


