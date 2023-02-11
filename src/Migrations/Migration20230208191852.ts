import { Migration } from '@mikro-orm/migrations';

export class Migration20230208191852 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "title" varchar(255) not null, "description" text not null, "image" varchar(255) not null, "up_votes" int not null, "down_votes" int not null);');

    this.addSql('drop table if exists "posts" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "posts" ("id" serial primary key, "created_at" timestamptz not null default null, "title" varchar not null default null, "description" text not null default null, "image" varchar not null default null, "up_votes" int4 not null default null, "down_votes" int4 not null default null);');

    this.addSql('drop table if exists "post" cascade;');
  }

}
