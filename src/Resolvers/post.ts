import { MaxLength } from "class-validator";
import { Arg, Ctx, Mutation, Query, Resolver, ObjectType, Field, InputType } from "type-graphql";
import { Post } from "../Entities/Post";
import { ContextType } from "../types";

// User would be able to find the post if he or she is able to predict the title and description
@InputType()
export class userInput {
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    title?: string; 

    @MaxLength(1000000)
    @Field(() => String, { nullable: true })
    description?: string; 
}

// Structure of an error
@ObjectType()
export class FieldError {
    @Field(() => String)
    field!: string;

    @Field(() => String)
    message!: string;
}

// Structure of the output display
@ObjectType()
export class PostResponse {
    @Field(() => FieldError, { nullable: true })
    error?: FieldError;

    @Field(() => Post, { nullable: true })
    post?: Post;
}

// POST API 
@Resolver()
export class PostResolver {
    // All posts
    @Query(() => [Post])
    async getAllPost(
        @Ctx() {em}: ContextType,
    ) {
      const posts = await em.find(Post, {});   
      return posts;
    }

    // Single post 
    @Query(() => PostResponse)
    async getPost(
        @Arg("id", () => Number) id: number,
        @Ctx() { em }: ContextType
    ): Promise<PostResponse> {
        const post = await em.findOne(Post, { id });
        if (!post) {
            return {
               error: {
                field: "id",
                message: "The id does not exist"
               } 
            }
        }  
        return {
            post 
        }
    }

    // Query based on Title or Description
    @Query(() => PostResponse)
    async findPost(
        @Arg("options", () => userInput) options: userInput,
        @Ctx() { em }: ContextType 
    ): Promise<PostResponse> {
        const { title, description } = options; 
        if (!description) {
            const post = await em.findOne(Post, { title });
            if (!post) {
                return {
                    error: {
                        field: "title",
                        message: "The title is not present"
                    }
                }
            }
            return {
                post
            };
        }
        if (!title) {
            const post = await em.findOne(Post, { description }) 
            if (!post) {
                return {
                    error: {
                        field: "description",
                        message: "No post has that description"
                    }
                } 
            }
            return {
                post
            };
        }
        const post = await em.findOne(Post, { title, description });
        if (!post) {
            return {
                error: {
                    field: "Title and Description",
                    message: "title and description have not matched"
                }
            }
        }
        return {
            post
        };
    }

    // Create post
    @Mutation(() => Post)
    async createPost(
        @Arg("title", () => String) title: string,
        @Arg("description", () => String) description: string,
        @Arg("image", () => String) image: string,
        @Ctx() { em }: ContextType
    ): Promise<Post> {
        const post = em.fork({}).create(Post, {
            title: title,
            createdAt: "",
            description: description,
            image: image,
            upVotes: 0,
            downVotes: 0
        });
        await em.persistAndFlush(post);
        return post;
    } 
}