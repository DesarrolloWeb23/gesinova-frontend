import * as contentful from 'contentful';

export const client = contentful.createClient({
    space: process.env.CLIENT_SPACE_ID || '',
    accessToken: process.env.CLIENT_ACCESS_TOKEN || '',
});