import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from './pages/Layout';
import { NoMatch } from './pages/NoMatch';
 
import { routes } from './routes.config';

function NestedRoute(route: any){
  return (
    <Route key={route.path} path={route.path} element={<route.component />} >
      {route.children?.map(child => (
        NestedRoute(child)
      ))}
    </Route>)
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {routes.map((route, i) => (
          NestedRoute(route)
        ))}
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}