"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20230208150856 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20230208150856 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "posts" ("id" serial primary key, "created_at" timestamptz(0) not null, "title" varchar(255) not null, "description" text not null, "image" varchar(255) not null, "up_votes" int not null, "down_votes" int not null);');
    }
}
exports.Migration20230208150856 = Migration20230208150856;
