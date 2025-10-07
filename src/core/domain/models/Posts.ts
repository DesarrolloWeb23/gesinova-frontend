export interface Posts {
    id: string;
    title: string;
    content: string;
    pictureUrl?: string;
    pictureAlt: string;
    pictureWidth?: number;
    pictureHeight?: number;
    createdAt: string;
};

export type PostsList = Posts[];