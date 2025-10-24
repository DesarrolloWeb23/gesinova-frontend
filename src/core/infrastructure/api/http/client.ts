import * as contentful from 'contentful';

const space = process.env.NEXT_PUBLIC_CLIENT_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CLIENT_ACCESS_TOKEN;

if (!space || !accessToken) {
    throw new Error("❌ Faltan variables de entorno de Contentful");
}

export const client = contentful.createClient({
    space,
    accessToken,
});