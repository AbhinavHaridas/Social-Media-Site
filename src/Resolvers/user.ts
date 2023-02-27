import { MaxLength } from "class-validator";
import { Resolver, InputType, Mutation, Field, Arg, Ctx, Query, ObjectType } from "type-graphql";
import { User } from "../Entities/User";
import { ContextType } from "../types";
import argon2 from "argon2";

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

    @Field(() => [User], { nullable: true })
    users?: User[];

    @Field(() => Boolean)
    success!: boolean;
}

// USER API
@Resolver()
export class UserResolver {
    // User Creation 
    @Mutation(() => User)
    async createUser(
        @Arg("details", () => UserInput) input: UserInput,
        @Ctx() { em }: ContextType
    ): Promise<User> {
        const { username, password, nickname } = input;
        const hashedPassword = await argon2.hash(password); 
        const user = em.fork({}).create(User, {
            username,
            password: hashedPassword,
            nickname
        });
        await em.persistAndFlush(user);
        return user; 
    }

    // Delete a user 
    @Mutation(() => UserResponse)
    async deleteUser(
        @Arg("id", () => Number) id: number,
        @Ctx() { em }: ContextType
    ): Promise<UserResponse> {
       const user = await em.nativeDelete(User, { id });
       if (!user) {
        return {
            error: {
                field: "User",
                message: "User was not found"
            },
            success: false 
        };
       }
       return {
            success: true
       };
    }

    // All Posts
    @Query(() => [User])
    async allUser(
        @Ctx() { em }: ContextType
    ): Promise<User[]> {
        const users = await em.find(User, {});
        return users;
    }

    // All Posts that have the same username
    @Query(() => UserResponse) 
    async titleUsers(
        @Arg("username", () => String) username: string,
        @Ctx() { em }: ContextType
    ): Promise<UserResponse> {
        const users = await em.find(User, { username });
        if (!users) {
            return {
                error: {
                    field: "Username",
                    message: "No users exist"
                },
                success: false
            }
        }
        return {
            users,
            success: true
        }
    } 

    // User login 
    @Query(() => UserResponse)
    async loginUser(
        @Arg("input",() => UserInput) input: UserInput,
        @Ctx() { em, req }: ContextType 
    ): Promise<UserResponse> {
        const { username, password } = input; 
        const user = await em.findOne(User, { username });
        if (!user) {
            return {
                error: {
                    field: "Username",
                    message: "The username does not exist"
                },
                success: false
            }
        } 
        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid) {
            return {
                error: {
                    field: "Password",
                    message: "The password is incorrect"
                },
                success: false
            };
        }

        req.session.userId = user.id;

        return {
            user,
            success: true
        }
    }

    // Displays Current User 
    @Query(() => UserResponse)
    async currentUser(
        @Ctx() { req, em }: ContextType
    ): Promise<UserResponse> {
        const id = req.session.userId;
        const user = await em.findOne(User, { id });
        if (!user) {
            return {
                error: {
                    field: "NO USER",
                    message: "No user is currently logged in"
                },
                success: false
            }
        }
        return {
            user,
            success: true
        }
    }

    // Find User 
    @Query(() => UserResponse) 
    async findUser(
        @Arg("inputs", () => UserInput2) input: UserInput2,
        @Ctx() { em }: ContextType
    ): Promise<UserResponse> {
        const { username } = input;
        const user = await em.findOne(User, { username });
        if (!user) {
            return {
                error: {
                    field: "User",
                    message: "The User does not exist"
                },
                success: false
            };
        }
        return {
           user,
           success: true
        };
    }
}