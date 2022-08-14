import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { matchPath, Params } from 'react-router-dom';
import { StaticRouter } from "react-router-dom/server";

import App from "./App";
import { routes } from './routes.config';
import { StaticContext } from './static-context';

export interface IServerContext {
  path: string;
  url: string;
  query: any;
  params: any;
}

export class RenderResult {
  body?: string;
  html?: string;
  data?: any;
  status: number = 200;
  headers: any = {};

  write(value: string): string {
    this.body = (this.body || "") + value;
    return this.body;
  }

  writeLine(value: string): string{
    return this.write(value + "\n");
  }
}

export async function render(context: IServerContext): Promise<RenderResult>  {

  let component;
  for(let route of routes) {
    const match = matchPath(route.path, context.path);

    if(match){
      component = route?.component as any;
      context.params = match.params;
      break;
    }
  }
 
  const result = new RenderResult();

  if(component?.serverside){
    await component.serverside(result, context);
  }

  if(!result.body){
    result.html = ReactDOMServer.renderToString(
      <React.StrictMode>
        <StaticContext.Provider value={result.data}>
          <StaticRouter location={context.url}>
            <App />
          </StaticRouter>
        </StaticContext.Provider>
  
      </React.StrictMode>
    );
  }

  return result;
}
