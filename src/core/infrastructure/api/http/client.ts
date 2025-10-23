import * as contentful from 'contentful';

export const client = contentful.createClient({
    space: process.env.NEXT_PUBLIC_CLIENT_SPACE_ID  || '',
    accessToken: process.env.NEXT_PUBLIC_CLIENT_ACCESS_TOKEN  || '',
});