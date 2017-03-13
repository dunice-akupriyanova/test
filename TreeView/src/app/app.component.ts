import { Component, Input } from '@angular/core';
import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
 

import { Hero } from './hero';
import { label } from './hero-detail.comonent';
import {HeroDetailComponent.label2} from './hero-detail.comonent';
const node7: Hero={name: 'node7', children:[], chosen: false};
const node1: Hero={name: 'node1', children:[], chosen: false};
const node2: Hero={name: 'node2', children:[node7], chosen: false};
const node3: Hero={name: 'node3', children:[node1, node2], chosen: false};
const node4: Hero={name: 'node4', children:[], chosen: false};
const node5: Hero={name: 'node5', children:[node3, node4], chosen: false};
const node6: Hero={name: 'node6', children:[], chosen: false};

const HEROES: Hero[] = [];

@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <form>
        <div>
          <label>Node:</label> <input name="newName" [(ngModel)]="newName" #heroName />
        </div>
        <div>
          <label>newName: </label>{{newName}}
        </div>
        <div>
            <input type="submit" value="Add!" class="button_add" (click)="add(heroName.value, heroes, label); heroName.value=''">
        </div>
    </form>
    <ul class="heroes">
      <li *ngFor="let hero of heroes">
        <my-hero-detail [hero]="hero" [newName]="heroName.value"></my-hero-detail>
      </li>
    </ul>
  `,
  styles: [`
    .selected {
      background-color: #CFD8DC !important;
      color: white;
    }
    .heroes {
      list-style-type: none;
      padding: 0;
      width: 15em;
    }
    .heroes li {
      cursor: pointer;
      position: relative;
      left: 0;
      background-color: #EEE;
      margin: .5em;
      padding: .3em 0;
      border-radius: 4px;
    }
    .heroes li.selected:hover {
      background-color: #BBD8DC !important;
      color: white;
    }
    .heroes li:hover {
      color: #607D8B;
      background-color: #DDD;
      left: .1em;
    }
    .heroes .text {
      position: relative;
      top: -3px;
    }
    .heroes .badge {
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
  heroes = HEROES;
  @Input()
  label2: Hero;
  add(n: string, heroes: Hero[], label): void {
      heroes.push({name: n, children: [], chosen: false});
    }    
  }
}

