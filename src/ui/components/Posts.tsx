import { GetPosts } from "@/core/domain/use-cases/GetPosts";
import { PostsService } from "@/core/infrastructure/api/services/PostsService";
import { useEffect, useState } from "react";
import Image from "next/image";
import { PostsList } from "@/core/domain/models/Posts";

export default function Posts() {
    const [posts, setPosts] = useState<PostsList>([]);

    const fetchPosts = async () => {
        try {
            const postsUseCase = new GetPosts(new PostsService());
            const response = await postsUseCase.execute();
            setPosts(response);
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {posts.map((post) => (
                <div key={post.id} className="group relative h-64 rounded-lg shadow-xl shadow-border overflow-hidden transition-all duration-400 ease-in-out">
                    <div className="obsolute w-full h-full bg-secondary transition-all duration-1000 ease-in-out">
                        {post.pictureUrl && (
                            <Image
                            src={'https:' + post.pictureUrl}
                            alt={post.pictureAlt}
                            className="rounded-t-lg object-cover w-full h-full"
                            width={post.pictureWidth}
                            height={post.pictureHeight}
                            />
                        )}
                    </div>
                    <div className="flex flex-col gap-2 absolute inset-x-0 bottom-0 bg-primary text-foreground rounded-t-xl p-3 w-full h-40 transition-all duration-1000 ease-in-out transform group-hover:translate-y-full">
                        <p className="text-xl font-bold"> {post.title}</p>
                        <p className="text-sm text-muted-foreground">Creado el: {new Date(post.createdAt).toLocaleDateString()}</p>
                        <p className="text-md leading-6">
                            {post.content}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}