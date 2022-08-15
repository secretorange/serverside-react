import React, { useContext, useEffect, useState } from "react";
import { ServersideContext } from "../contexts/serverside-context";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    __serverside: any;
  }
}

export function useServerside(): any{
  // Try and get the static data from the context.
  // This is only used server side
  const serverData = useContext(ServersideContext);

  if (serverData) {
    return serverData;
  }

  let [data, setData] = useState(undefined);

  const isBrowser = typeof window !== "undefined";
  if (isBrowser) {
    const location = useLocation();

    if (window.__serverside) {
      data = window.__serverside;
    }

    useEffect(() => {
        let alive = true;

        // Make a request to the same url but tell the server to only
        // send back the JSON serverside props
        fetch(location.pathname + "?__serverside=true")
          .then((response) => response.json())
          .then((data) => {
            // Check the component is still there
            if (alive) {
              setData(data);

              delete window.__serverside;
            }
          });

        return () => {
          // Make sure we don't try to setData if the effect has been cleaned
          alive = false;
        };
 
    }, [location.pathname]);
  }

  return data;
}
