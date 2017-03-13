"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var hero_1 = require('./hero');
var app_component_1 = require('./app.component');
var label;
var HeroDetailComponent = (function () {
    function HeroDetailComponent() {
    }
    HeroDetailComponent.prototype.clear = function (hero) {
        hero.chosen = false;
        if (hero.children) {
            for (var i = 0; i < hero.children.length; i++) {
                this.clear(hero.children[i]);
            }
        }
    };
    HeroDetailComponent.prototype.onSelect = function (hero) {
        if (hero.chosen == true) {
            this.clear(hero);
        }
        else
            hero.chosen = true;
    };
    HeroDetailComponent.prototype.addLabel = function (hero, newName) {
        console.log('newName=' + newName);
        if (newName) {
            if (newName.length != 0) {
                hero.children.push({ name: newName, children: [], chosen: false });
                console.log('newName=' + newName);
                app_component_1.label = hero;
                console.log(app_component_1.label);
            }
        }
    };
    HeroDetailComponent.prototype.print = function () {
        console.log('ok');
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', hero_1.Hero)
    ], HeroDetailComponent.prototype, "hero", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], HeroDetailComponent.prototype, "newName", void 0);
    HeroDetailComponent = __decorate([
        core_1.Component({
            selector: 'my-hero-detail',
            template: "\n    <div *ngIf=\"hero\">\n     <span *ngIf=\"(hero.children)&&(hero.chosen!=true)&&(hero.children.length)\" (click)=\"onSelect(hero)\" class=\"badge\">+</span><span *ngIf=\"(hero.children)&&(hero.chosen==true)&&(hero.children.length)\" (click)=\"onSelect(hero)\" class=\"badge\">-</span>\n     {{hero.name}}\n     <button class=\"addNode\" (click)=\"addLabel(hero, newName)\">+</button>\n      <ul class=\"heroes\" *ngIf=\"hero.chosen==true\">\n          <li *ngFor=\"let h of hero.children\">\n          <my-hero-detail [hero]=\"h\" [newName]=\"newName\"></my-hero-detail>\n        </ul>\n    </div>\n  ",
            styles: ["\n    .heroes {\n      list-style-type: none;\n      padding: 0;\n      width: 15em;\n    }\n    .heroes li {\n      cursor: pointer;\n      position: relative;\n      left: 0;\n      background-color: #EEE;\n      margin: .5em;\n      padding: .3em 0;\n      border-radius: 4px;\n    }\n    .heroes li:hover {\n      color: #607D8B;\n      background-color: #DDD;\n      left: .1em;\n    }\n    .heroes .text {\n      position: relative;\n      top: -3px;\n    }\n    .badge {\n      color: black;\n      display: inline-block;\n      font-size: small;\n      background-color: gray;\n      padding: 0.8em 0.7em 0 0.7em;\n      line-height: 1em;\n      position: relative;\n      left: -1px;\n      top: -4px;\n      height: 1.8em;\n      margin-right: .8em;\n      border-radius: 4px 0 0 4px;\n    }\n  "]
        }), 
        __metadata('design:paramtypes', [])
    ], HeroDetailComponent);
    return HeroDetailComponent;
}());
exports.HeroDetailComponent = HeroDetailComponent;
app_component_1.label;
//# sourceMappingURL=hero-detail.component.js.map