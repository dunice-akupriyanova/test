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
var node_1 = require('./node');
var NewNodeComponent = (function () {
    function NewNodeComponent() {
    }
    NewNodeComponent.prototype.clear = function (node) {
        node.open = false;
        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                this.clear(node.children[i]);
            }
        }
    };
    NewNodeComponent.prototype.onSelect = function (node) {
        if (node.open == true) {
            this.clear(node);
        }
        else
            node.open = true;
    };
    NewNodeComponent.prototype.addLabel = function (node, newName) {
        if (newName) {
            if (newName.length != 0) {
                node.children.push({ name: newName, children: [], open: false });
            }
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', node_1.Node)
    ], NewNodeComponent.prototype, "node", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NewNodeComponent.prototype, "newName", void 0);
    NewNodeComponent = __decorate([
        core_1.Component({
            selector: 'new-node',
            template: "\n    <div *ngIf=\"node\">\n     <span *ngIf=\"(node.children)&&(node.open!=true)&&(node.children.length)\" (click)=\"onSelect(node)\" class=\"badge\">+</span><span *ngIf=\"(node.children)&&(node.open==true)&&(node.children.length)\" (click)=\"onSelect(node)\" class=\"badge\">-</span>\n     {{node.name}}\n     <button class=\"addNode\" (click)=\"addLabel(node, newName)\">+</button>\n      <ul class=\"nodes\" *ngIf=\"node.open==true\">\n          <li *ngFor=\"let h of node.children\">\n          <new-node [node]=\"h\" [newName]=\"newName\"></new-node>\n        </ul>\n    </div>\n  ",
            styles: ["\n    .nodes {\n      list-style-type: none;\n      padding: 0;\n      width: 15em;\n    }\n    .nodes li {\n      cursor: pointer;\n      position: relative;\n      left: 0;\n      background-color: #EEE;\n      margin: .5em;\n      padding: .3em 0;\n      border-radius: 4px;\n    }\n    .nodes li:hover {\n      color: #607D8B;\n      background-color: #DDD;\n      left: .1em;\n    }\n    .nodes .text {\n      position: relative;\n      top: -3px;\n    }\n    .badge {\n      color: black;\n      display: inline-block;\n      font-size: small;\n      background-color: gray;\n      padding: 0.8em 0.7em 0 0.7em;\n      line-height: 1em;\n      position: relative;\n      left: -1px;\n      top: -4px;\n      height: 1.8em;\n      margin-right: .8em;\n      border-radius: 4px 0 0 4px;\n    }\n  "]
        }), 
        __metadata('design:paramtypes', [])
    ], NewNodeComponent);
    return NewNodeComponent;
}());
exports.NewNodeComponent = NewNodeComponent;
//# sourceMappingURL=new-node.component.js.map