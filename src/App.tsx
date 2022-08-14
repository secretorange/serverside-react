import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from './pages/Layout';
import { NoMatch } from './pages/NoMatch';
 
import { routes } from './routes.config';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {routes.map((route, i) => (
          <Route key={i} path={route.path} element={<route.component />} />
        ))}
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}



 