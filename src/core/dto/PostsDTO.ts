import { z } from 'zod';
import { RichTextNodeDTO } from './RichTextNodeDTO';

export const PostsDTO = z.object({
    items: z.array(z.object({
        fields: z.object({
            tittle: z.string(),
            content: RichTextNodeDTO,
            picture: z.object({
                fields: z.object({
                    title: z.string(),
                    file: z.object({
                        url: z.string(),
                        details: z.object({
                            size: z.number(),
                            image: z.object({
                                width: z.number(),
                                height: z.number()
                            }).nullable()
                        }),
                        fileName: z.string(),
                        contentType: z.string()
                    })
                })
            }).optional()
        }),
        metadata: z.object({
            concepts: z.array(z.object({})),
            tags: z.array(z.object({})),
        }),
        sys: z.object({
            contentType: z.object({
                sys: z.object({
                    id: z.string(),
                    linkType: z.string(),
                    type: z.string()
                })
            }),
            createdAt: z.string(),
            environment: z.object({
                sys: z.object({
                    id: z.string(),
                    linkType: z.string(),
                    type: z.string()
                })
            }),
            id: z.string(),
            locale: z.string(),
            publishedVersion: z.number().nullable(),
            revision: z.number(),
            space: z.object({
                sys: z.object({
                    id: z.string(),
                    linkType: z.string(),
                    type: z.string()
                })
            }),
            type: z.string(),
            updatedAt: z.string()
        })
    })),
    limit: z.number(),
    skip: z.number(),
    sys: z.object({
        type: z.string()
    }),
    total: z.number()
});