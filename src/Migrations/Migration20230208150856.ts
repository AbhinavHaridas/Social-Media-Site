import { Migration } from '@mikro-orm/migrations';

export class Migration20230208150856 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "posts" ("id" serial primary key, "created_at" timestamptz(0) not null, "title" varchar(255) not null, "description" text not null, "image" varchar(255) not null, "up_votes" int not null, "down_votes" int not null);');
  }

}
