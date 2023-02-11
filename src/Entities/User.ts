import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from 'type-graphql';

// Stores Users
@ObjectType()
@Entity()
export class User {
   @Field(() => Number) 
   @PrimaryKey({ type: 'number' }) 
   id!: number; 

   @Field(() => String)
   @Property({ type: "string" })
   username!: string;

   @Property({ type: "string" })
   password!: string;

   @Field(() => String)
   @Property({ type: "string" })
   nickname!: string;
}