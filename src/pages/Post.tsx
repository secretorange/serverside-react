import axios from "axios"
import type { IServerContext } from 'src/entry.server';
import type { RenderResult } from '/src/entry.server';
import { useServerside } from '/src/hooks/useServerside';
 

interface IData {
    title: string,
    content: string
}
  
 
export function Post() {
 
    const data:IData = useServerside();

    return (
        <div className="">
            <h2 className='font-bold text-lg'>{data?.title}</h2>
            <div>{data?.body}</div>
        </div>
    );
}

 
// This code is ALWAYS run on the server
Post.serverside = async (result: RenderResult, context: IServerContext): Promise<void> => {
 
    const id = context.params.id;
 
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/' + id);

    result.data = await response.data;
}
