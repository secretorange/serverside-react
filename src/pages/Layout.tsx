import React from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";

export function Layout() {
  return (
    <div>
      <nav>
        <ul className="flex gap-5 justify-center p-10">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/posts/1">Post id:1</Link>
          </li>
          <li>
            <Link to="/posts/2">Post id:2</Link>
          </li>
          <li>
            <a href="/redirect-to-post/3">Redirect</a>
          </li>
          <li>
            <a href="/sitemap">Sitemap</a>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
}
