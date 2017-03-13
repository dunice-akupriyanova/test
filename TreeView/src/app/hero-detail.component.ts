import { Component, Input } from '@angular/core';

import { Hero } from './hero';
import { label } from './app.component';
import { AppComponent } from './app.component';
// let label: hero;

@Component({
  selector: 'my-hero-detail',
  template: `
    <div *ngIf="hero">
     <span *ngIf="(hero.children)&&(hero.chosen!=true)&&(hero.children.length)" (click)="onSelect(hero)" class="badge">+</span><span *ngIf="(hero.children)&&(hero.chosen==true)&&(hero.children.length)" (click)="onSelect(hero)" class="badge">-</span>
     {{hero.name}}
     <button class="addNode" (click)="addLabel(hero, newName)">+</button>
      <ul class="heroes" *ngIf="hero.chosen==true">
          <li *ngFor="let h of hero.children">
          <my-hero-detail [hero]="h" [newName]="newName"></my-hero-detail>
        </ul>
    </div>
  `,
  styles: [`
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
    .heroes li:hover {
      color: #607D8B;
      background-color: #DDD;
      left: .1em;
    }
    .heroes .text {
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
export class HeroDetailComponent {
  @Input()
  hero: Hero;
  @Input()
  newName: String;
  clear(hero: Hero): void {
    hero.chosen=false;
	if (hero.children){
		for (let i=0; i<hero.children.length; i++){
		  this.clear(hero.children[i]);
		}
	}
  }
  onSelect(hero: Hero): void {
    if(hero.chosen == true){
      this.clear(hero);
    }
      else hero.chosen=true;
  }
  addLabel(hero: Hero, newName: String): void {
    if (newName){
      if (newName.length!=0){
        hero.children.push({name: newName, children:[], chosen: false});
        // label=hero;
      }
    }
  }
  print(): void {
    console.log('ok');
  }
}
export label;


