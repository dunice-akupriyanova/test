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
var NodeComponent = (function () {
    function NodeComponent() {
    }
    NodeComponent.prototype.clear = function (node) {
        node.open = false;
        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                this.clear(node.children[i]);
            }
        }
    };
    NodeComponent.prototype.onSelect = function (node) {
        if (node.open) {
            this.clear(node);
        }
        else
            node.open = true;
    };
    NodeComponent.prototype.addNode = function (node, newName) {
        if (!newName) {
            return;
        }
        if (!newName.length) {
            return;
        }
        node.children.push(new Node(newName, [], false));
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Node)
    ], NodeComponent.prototype, "node", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NodeComponent.prototype, "newName", void 0);
    NodeComponent = __decorate([
        core_1.Component({
            selector: 'node',
            moduleId: module.id,
            templateUrl: './node.component.html',
            styleUrls: ['../style.css']
        }), 
        __metadata('design:paramtypes', [])
    ], NodeComponent);
    return NodeComponent;
}());
exports.NodeComponent = NodeComponent;
var Node = (function () {
    function Node(name, children, open) {
        this.name = name;
        this.children = children;
        this.open = open;
    }
    return Node;
}());
exports.Node = Node;
//# sourceMappingURL=node.component.js.map