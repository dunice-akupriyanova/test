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
var node7 = { name: 'node7', children: [], chosen: false };
var node1 = { name: 'node1', children: [], chosen: false };
var node2 = { name: 'node2', children: [node7], chosen: false };
var node3 = { name: 'node3', children: [node1, node2], chosen: false };
var node4 = { name: 'node4', children: [], chosen: false };
var node5 = { name: 'node5', children: [node3, node4], chosen: false };
var node6 = { name: 'node6', children: [], chosen: false };
var HEROES = [];
var AppComponent = (function () {
    function AppComponent() {
        this.title = 'TreeView';
        this.newName = '';
        this.heroes = HEROES;
    }
    AppComponent.prototype.add = function (n, heroes, label) {
        heroes.push({ name: n, children: [], chosen: false });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', hero_1.Hero)
    ], AppComponent.prototype, "label2", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "\n    <h1>{{title}}</h1>\n    <form>\n        <div>\n          <label>Node:</label> <input name=\"newName\" [(ngModel)]=\"newName\" #heroName />\n        </div>\n        <div>\n          <label>newName: </label>{{newName}}\n        </div>\n        <div>\n            <input type=\"submit\" value=\"Add!\" class=\"button_add\" (click)=\"add(heroName.value, heroes, label); heroName.value=''\">\n        </div>\n    </form>\n    <ul class=\"heroes\">\n      <li *ngFor=\"let hero of heroes\">\n        <my-hero-detail [hero]=\"hero\" [newName]=\"heroName.value\"></my-hero-detail>\n      </li>\n    </ul>\n  ",
            styles: ["\n    .selected {\n      background-color: #CFD8DC !important;\n      color: white;\n    }\n    .heroes {\n      list-style-type: none;\n      padding: 0;\n      width: 15em;\n    }\n    .heroes li {\n      cursor: pointer;\n      position: relative;\n      left: 0;\n      background-color: #EEE;\n      margin: .5em;\n      padding: .3em 0;\n      border-radius: 4px;\n    }\n    .heroes li.selected:hover {\n      background-color: #BBD8DC !important;\n      color: white;\n    }\n    .heroes li:hover {\n      color: #607D8B;\n      background-color: #DDD;\n      left: .1em;\n    }\n    .heroes .text {\n      position: relative;\n      top: -3px;\n    }\n    .heroes .badge {\n      display: inline-block;\n      font-size: small;\n      color: white;\n      padding: 0.8em 0.7em 0 0.7em;\n      background-color: #607D8B;\n      line-height: 1em;\n      position: relative;\n      left: -1px;\n      top: -4px;\n      height: 1.8em;\n      margin-right: .8em;\n      border-radius: 4px 0 0 4px;\n    }\n  "]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map