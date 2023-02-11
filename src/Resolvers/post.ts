import { title } from "process";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../Entities/post";
import { ContextType } from "../types";

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
    @Query(() => Post, { nullable: true })
    async getPost(
        @Arg("id", () => Number) id: number,
        @Ctx() {em}: ContextType
    ): Promise<Post | null> {
        const post = await em.findOne(Post, {id}); 
        return post; 
    }

    // Create post
    @Mutation(() => Post)
    async createPost(
        @Arg("title", () => String) title: string,
        @Arg("description", () => String) description: string,
        @Arg("image", () => String) image: string,
        @Ctx() {em}: ContextType
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