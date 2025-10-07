import { PostsRepository } from "@/core/domain/ports/PostsRepository";
import { client } from "../http/client";
import { PostsDTO } from "@/core/dto/PostsDTO";
import { z, ZodError } from 'zod';
import { AxiosError } from 'axios';
import { ApiErrorDTO } from '@/core/dto/ApiErrorDTO';

const PostsApiResponseDTO = PostsDTO;
type PostsApiResponse = z.infer<typeof PostsApiResponseDTO>;

export class PostsService implements PostsRepository {

    async getPosts(): Promise<PostsApiResponse> {
        try {
            const response = await client.getEntries( { content_type: 'post' } );
            return PostsApiResponseDTO.parse(response);
        } catch (err: unknown) {
            if (err instanceof ZodError) {
                // Error de validación Zod en respuesta de la API
                throw {
                    type: "validation",
                    issues: err.errors,
                };
            }

            // Error devuelto desde el backend (AxiosError)
            if (err instanceof AxiosError && err.response?.data) {
                const parsed = ApiErrorDTO.safeParse(err.response.data);
                if (parsed.success) {
                    throw {
                        type: "api",
                        ...parsed.data,
                    };
                } else {
                    // Respuesta de error de API no coincide con el DTO
                    throw {
                        type: "unknown_api_error",
                        issues: parsed.error.errors,
                    };
                }
            }

            // Error desconocido
            console.error("Error inesperado", err);
            throw {
                type: "unknown",
                issues: err,
            };
        }
    } 
}