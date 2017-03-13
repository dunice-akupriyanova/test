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
var NODES = [];
var AppComponent = (function () {
    function AppComponent() {
        this.title = 'TreeView';
        this.newName = '';
        this.nodes = NODES;
    }
    AppComponent.prototype.add = function (n, nodes) {
        nodes.push({ name: n, children: [], open: false });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [String, Array]), 
        __metadata('design:returntype', void 0)
    ], AppComponent.prototype, "add", null);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "\n    <h1>{{title}}</h1>\n    <form>\n        <div>\n          <label>Node:</label> <input name=\"newName\" [(ngModel)]=\"newName\" #nodeName />\n        </div>\n        <div>\n            <input type=\"submit\" value=\"Add!\" class=\"button_add\" (click)=\"add(nodeName.value, nodes); nodeName.value=''\">\n        </div>\n    </form>\n    <ul class=\"nodes\">\n      <li *ngFor=\"let node of nodes\">\n        <new-node [node]=\"node\" [newName]=\"nodeName.value\"></new-node>\n      </li>\n    </ul>\n  ",
            styles: ["\n    .selected {\n      background-color: #CFD8DC !important;\n      color: white;\n    }\n    .nodes {\n      list-style-type: none;\n      padding: 0;\n      width: 15em;\n    }\n    .nodes li {\n      cursor: pointer;\n      position: relative;\n      left: 0;\n      background-color: #EEE;\n      margin: .5em;\n      padding: .3em 0;\n      border-radius: 4px;\n    }\n    .nodes li.selected:hover {\n      background-color: #BBD8DC !important;\n      color: white;\n    }\n    .nodes li:hover {\n      color: #607D8B;\n      background-color: #DDD;\n      left: .1em;\n    }\n    .nodes .text {\n      position: relative;\n      top: -3px;\n    }\n    .nodes .badge {\n      display: inline-block;\n      font-size: small;\n      color: white;\n      padding: 0.8em 0.7em 0 0.7em;\n      background-color: #607D8B;\n      line-height: 1em;\n      position: relative;\n      left: -1px;\n      top: -4px;\n      height: 1.8em;\n      margin-right: .8em;\n      border-radius: 4px 0 0 4px;\n    }\n  "]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map