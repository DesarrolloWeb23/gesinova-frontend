import { z } from "zod";
import { PostsDTO } from "@/core/dto/PostsDTO";

export type PostsApiResponse = z.infer<typeof PostsDTO>;

export interface PostsRepository {
    getPosts(): Promise<PostsApiResponse>;
}