Serverside React
===

Base React and Vite project to support Serverside rendering with a NodeJS Azure Function. Things to look out for:

* Dev server uses Vite for a fast hot reload experience 
* Production server uses a NodeJS Azure Function and simply calls `ReactDOMServer.renderToString(...)`
* Async code to get data from the api is added as a static `serverside` function on the component. e.g.
```
// This code is ALWAYS run on the server
Post.serverside = async (result: RenderResult, context: IServerContext): Promise<void> => {
 
    const id = context.params.id;
 
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/' + id);

    result.data = await response.data;
}
```
* Page data from the inital load or subsequent calls to the API (which can be cached) can be picked up using a hook:
```
export function Post() {

    const data:IData = useServerside();

    return (
        ...
    );
}
```
* The inital data from the Serverside Render is added as a `window.__serverside = {...}` property on window.
* When navigating the app, the hook calls the same page url to get the page data using a `__serverside=true` querystring param to let the server know that the client is already hydrated and just wants JSON. 

* Routes are defined in `src/routes.config.ts`
```
export const routes = [
    {
        path:"posts/:id",
        component: Post
    }
];
```
* Redirects are defind in `src/redirects.js`
```
module.exports = [
    {
      source: '/redirect-to-post/:id',
      destination: '/posts/:id', 
      permanent: true,
    }
];
```

* The serverside function can deal with the response directly, bypassing React, as in the sitemap example.
```
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

```

Dev
---
`npm run start`

Testing production function locally:
---
`func host start`

Build production (to dist folder)
---
`npm run build`
