"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Posts = void 0;
const core_1 = require("@mikro-orm/core");
// Posts that the user can generate 
let Posts = class Posts {
    constructor() {
        this.createdAt = new Date();
    }
};
__decorate([
    (0, core_1.PrimaryKey)({ type: 'int' })
], Posts.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ type: 'date' })
], Posts.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string' })
], Posts.prototype, "title", void 0);
__decorate([
    (0, core_1.Property)({ type: 'text' })
], Posts.prototype, "description", void 0);
__decorate([
    (0, core_1.Property)({ type: 'string' })
], Posts.prototype, "image", void 0);
__decorate([
    (0, core_1.Property)({ type: 'int' })
], Posts.prototype, "upVotes", void 0);
__decorate([
    (0, core_1.Property)({ type: 'int' })
], Posts.prototype, "downVotes", void 0);
Posts = __decorate([
    (0, core_1.Entity)()
], Posts);
exports.Posts = Posts;
