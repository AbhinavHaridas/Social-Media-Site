import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

// Posts that the user can generate 
@Entity()
export class Posts {
    @PrimaryKey({ type: 'int' })
    id!: number;

    @Property({ type: 'date' })
    createdAt = new Date();

    @Property({ type: 'string' })
    title!: string;

    @Property({ type: 'text' })
    description!: string;

    @Property({ type: 'string' })
    image!: string;

    @Property({ type: 'int' })
    upVotes!: number;

    @Property({ type: 'int' })
    downVotes!: number;
}