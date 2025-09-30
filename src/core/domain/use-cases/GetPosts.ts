import { Posts } from "../models/Posts";
import { RichTextNode } from "../models/RichTextNode";
import { PostsApiResponse, PostsRepository } from "../ports/PostsRepository";
import { Error as AppError } from "@/core/domain/models/Error";

// 🔹 Función para parsear RichText
function parseRichText(content: RichTextNode): string {
    if (!content?.content) return "";

    return content.content
        .map((node: RichTextNode) => {
            if (node.nodeType === "paragraph") {
                return node.content?.map((child: RichTextNode) => (child.nodeType === "text" ? child.value : "")).join("");
            }
            return "";
        })
        .join("\n");
}

// 🔹 Mapper para transformar la respuesta en modelos de dominio
function mapPostsResponse(response: PostsApiResponse): Posts[] {
    return response.items.map((item) => {
        const { sys, fields } = item;

        return {
            id: sys.id,
            title: fields.tittle,
            content: parseRichText(fields.content as RichTextNode),
            pictureUrl: fields.picture?.fields?.file?.url ?? "",
            pictureAlt: fields.picture?.fields?.title ?? "",
            pictureWidth: fields.picture?.fields?.file?.details?.image?.width,
            pictureHeight: fields.picture?.fields?.file?.details?.image?.height,
            createdAt: sys.createdAt,
        };
    });
}

export class GetPosts {
    constructor(private postsRepository: PostsRepository) {}

    async execute(): Promise<Posts[]> {
        try {
            const response = await this.postsRepository.getPosts();
            return mapPostsResponse(response);
        } catch (err) {
            const error = err as AppError;

            if (error.type === "api") {
                switch (error.status) {
                    case 403: throw { status: "ACCESS_DENIED", message: error.message };
                    case 400: throw { status: "VALIDATION_ERROR", message: error.message };
                    case 429: throw { status: "TOO_MANY_REQUESTS", message: error.message };
                    case 401: throw { status: "UNAUTHORIZED", message: error.message };
                    case 404: throw { status: "NOT_FOUND", message: error.message };
                }
            }

            if (error.type === "validation") {
                throw { status: "VALIDATION_ERROR", message: "La estructura de datos recibida no es válida." };
            }

            if (error.type === "unknown_api_error") {
                throw { status: "UNKNOWN_API_ERROR", message: "La estructura de error de la API no es válida." };
            }

            throw { status: "UNKNOWN_ERROR", message: "Error de red" };
        }
    }
}
