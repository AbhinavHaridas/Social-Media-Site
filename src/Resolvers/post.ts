import { title } from "process";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Posts } from "../Entities/post";
import { ContextType } from "../types";

// POST API 
@Resolver()
export class PostResolver {
    // All posts
    @Query(() => [Posts])
    async getAllPosts(
        @Ctx() {em}: ContextType,
    ) {
      const posts = await em.find(Posts, {});   
      return posts;
    }

    // Create post
    @Mutation(() => Posts)
    async createPost(
        @Arg("title", () => String) title: string,
        @Arg("description", () => String) description: string,
        @Arg("image", () => String) image: string,
        @Ctx() {em}: ContextType
    ): Promise<Posts> {
        const post = em.fork({}).create(Posts, {
            title: title,
            createdAt: "",
            description: "",
            image: "",
            upVotes: 0,
            downVotes: 0
        });
        await em.persistAndFlush(post);
        return post;
    } 
}