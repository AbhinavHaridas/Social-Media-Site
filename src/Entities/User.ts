import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from 'type-graphql';

// Stores Users
@ObjectType()
@Entity()
export class User {
   @Field(() => Number) 
   @PrimaryKey({ type: 'number' }) 
   id!: number; 
}