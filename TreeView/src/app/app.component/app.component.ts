import { Component, Input } from '@angular/core';
import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BrowserModule} from '@angular/platform-browser';
import { Node} from '../node.component/node.component';
 
@Component({
  selector: 'my-app',
  moduleId: module.id,
  templateUrl: './app.component.html',
  styleUrls: [ '../style.css' ]
})
export class AppComponent {
  title = 'TreeView';
  newName: string='';
  root=new Node('', [], false);
  add(name: string): void {
      this.root.children.push(new Node(name, [], false));
    }    
  }

