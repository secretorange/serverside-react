import React, { useContext, useEffect, useState } from "react";
import { StaticContext } from "../static-context";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    __serverside: any;
  }
}

export function useServerside(): any{
  // Try and get the static data from the context.
  // This is only used server side
  const serverData = useContext(StaticContext);

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

      if (!data) {
        let alive = true;

        console.log("here");
        // Make a request to the same url but tell the server to only
        // send back the JSON serverside props
        fetch(location.pathname + "?__serverside=true")
          .then((response) => response.json())
          .then((data) => {
            // Check the component is still there
            if (alive) {
              setData(data);
            }
          });

        return () => {
          // Make sure we don't try to setData if the effect has been cleaned
          alive = false;
        };
      } else {
        setData(data);

        delete window.__serverside;
      }
    }, [location.pathname]);
  }

  return data;
}
