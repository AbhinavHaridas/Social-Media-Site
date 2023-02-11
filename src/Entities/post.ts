import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

// Post that the user can generate 
@ObjectType()
@Entity()
export class Post {
    @Field(() => Number)
    @PrimaryKey({ type: 'number' })
    id!: number;

    @Field(() => String)
    @Property({ type: 'date' })
    createdAt = new Date();

    @Field(() => String)
    @Property({ type: 'string' })
    title!: string;

    @Field(() => String)
    @Property({ type: 'text' })
    description!: string;

    @Field(() => String)
    @Property({ type: 'string' })
    image!: string;

    @Field(() => Number)
    @Property({ type: 'int' })
    upVotes!: number;

    @Field(() => Number)
    @Property({ type: 'int' })
    downVotes!: number;
}