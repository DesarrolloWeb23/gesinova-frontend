export interface RichTextNode {
    nodeType: string;
    value?: string;
    data: Record<string, undefined>;
    content?: RichTextNode[]; 
}

export type RichText = RichTextNode[];