import { MaxLength } from "class-validator";
import { Resolver, InputType, Mutation, Field, Arg, Ctx, Query, ObjectType } from "type-graphql";
import { User } from "../Entities/User";
import { ContextType } from "../types";

// Fields that the user needs to enter
@InputType()
class UserInput {
    @MaxLength(3000)
    @Field(() => String)
    username!: string;

    @MaxLength(3000)
    @Field(() => String)
    password!: string;

    @MaxLength(3000)
    @Field(() => String)
    nickname!: string;
}

// Field that can be used for user search
@InputType()
class UserInput2 {
    @MaxLength(3000)
    @Field(() => String)
    username!: string;

    @MaxLength(3000)
    @Field(() => String)
    nickname!: string;
}

// Structure of the error
@ObjectType()
class UserError {
    @Field(() => String)
    field!: string;

    @Field(() => String)
    message!: string;
}

// Field that shows user response
@ObjectType()
class UserResponse {
    @Field(() => UserError, { nullable: true })
    error?: UserError;

    @Field(() => User, { nullable: true })
    user?: User;
}

// USER API
@Resolver()
export class UserResolver {
    // Create a user using the user input
    @Mutation(() => User)
    async createUser(
        @Arg("details", () => UserInput) input: UserInput,
        @Ctx() { em }: ContextType
    ): Promise<User> {
        const user = em.fork({}).create(User, input);
        await em.persistAndFlush(user);
        return user;
    }

    // Find all the posts
    @Query(() => [User])
    async allUser(
        @Ctx() { em }: ContextType
    ): Promise<User[]> {
        const users = await em.find(User, {});
        return users;
    }

    // Find a user based on his details 
    @Query(() => UserResponse) 
    async findUser(
        @Arg("inputs", () => UserInput2) input: UserInput2,
        @Ctx() { em }: ContextType
    ): Promise<UserResponse> {
        const { username } = input;
        const user = await em.findOne(User, { username });
        if (!user) {
            // If user does not exist it returns error
            return {
                error: {
                    field: "User",
                    message: "The User does not exist"
                }
            };
        }
        return {
           user
        };
    }
}