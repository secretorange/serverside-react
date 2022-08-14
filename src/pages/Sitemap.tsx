import type { RenderResult } from '../entry.server';
 
export function Sitemap() {}

async function getSiteMap(): Promise<string[]> {
    const items: string[] = [];

    items.push("home");
    items.push("about");

    return items;
} 

Sitemap.serverside = async (result: RenderResult): Promise<any> => {

    const AppUrl = "https://todo_get_app_url/";

    const items = await getSiteMap()

    const url = (url: string): string => {
        if (!url) {
            return url;
        }

        if (url.startsWith("https://")) {
            return url;
        }

        return AppUrl + url;
    };
    
    result.headers["Content-Type"] = "application/xml";

    result.writeLine(`<?xml version="1.0" encoding="UTF-8"?>`);
    result.writeLine(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

    for (let item of items) {
        result.writeLine(`<url>`);
        result.writeLine(`<loc>${url(item)}</loc>`);
        result.writeLine(`</url>`);
    }

    result.writeLine(`</urlset>`);

}
