import { Post } from './pages/Post';
import { Home } from './pages/Home';
import { Sitemap } from './pages/Sitemap';

 
export const routes = [
    {
        path:"",
        component: Home
    },
    {
        path:"posts/:id",
        component: Post
    },
    {
        path:"sitemap",
        component: Sitemap
    },
];