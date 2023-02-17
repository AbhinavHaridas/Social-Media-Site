import { MaxLength } from "class-validator";
import { Arg, Ctx, Mutation, Query, Resolver, ObjectType, Field, InputType } from "type-graphql";
import { Post } from "../Entities/Post";
import { ContextType } from "../types";

// User Input 
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

    @Field(() => [Post], { nullable: true })
    posts?: Post[];

    @Field(() => Boolean)
    success!: boolean;
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
                field: "ID ERROR",
                message: "The id does not exist"
               }, 
               success: false 
            }
        }  
        return {
            post,
            success: true 
        }
    }

   // Multiple Posts based on title
    @Query(() => PostResponse)
    async titlePosts(
        @Arg("title", () => String) title: string,
        @Ctx() { em }: ContextType
    ): Promise<PostResponse> {
        const posts = await em.find(Post, { title });
        if (posts.length == 0) {
            return {
                error: {
                    field: "TITLE ERROR",
                    message: "there are no posts with that title"
                },
                success: false
            }
        }
        return {
            posts,
            success: true
        }
    }

    //  Post based on Title or Description
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
                        field: "TITLE ERROR",
                        message: "The title is not present"
                    },
                    success: false 
                }
            }
            return {
                post,
                success: true
            };
        }
        if (!title) {
            const post = await em.findOne(Post, { description }) 
            if (!post) {
                return {
                    error: {
                        field: "DESCRIPTION ERROR",
                        message: "No post has that description"
                    },
                    success: false 
                } 
            }
            return {
                post,
                success: true
            };
        }
        const post = await em.findOne(Post, { title, description });
        if (!post) {
            return {
                error: {
                    field: "TITLE DESCRIPTION ERROR",
                    message: "title and description have not matched"
                },
                success: false
            }
        }
        return {
            post,
            success: true
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
    
    // Update post
    @Mutation(() => PostResponse)
    async updatePost(
        @Arg("title_new_description", () => userInput) input: userInput,
        @Ctx() { em }: ContextType
    ): Promise<PostResponse> {
        const { title, description } = input;
        const post = await em.findOne(Post, { title }) 
        if (!post) {
            return {
                error: {
                    field: "POST TITLE ERROR",
                    message: "There is no post with that title"
                },
                success: false
            }
        }
        await em.nativeUpdate(Post, { title }, { description });
        return {
            success: true
        }
    } 

    // Delete post
    @Mutation(() => PostResponse)
    async deletePost(
        @Arg("id", () => Number) id: number,
        @Ctx() { em }: ContextType
    ): Promise<PostResponse> {
        const post = await em.nativeDelete(Post, { id });
        if (!post) {
            return {
                error: {
                    field: "POST ERROR",
                    message: `There is no post with ID: ${id}`
                },
                success: false
            }
        }
        return {
            success: true
        }
    }
}