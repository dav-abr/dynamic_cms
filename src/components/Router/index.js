import React from "react";
import { Switch, Route } from "react-router-dom";
import config from "../../config";
import PageConstructor from "../PageConstructor";
import Loading from "../Loading";

const Router = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <Switch>
        {config.map((c) => (
          <Route exact path={c.url} key={c.url}>
            <PageConstructor {...c.page} />
          </Route>
        ))}
        <Route>
          <h1>404</h1>
        </Route>
      </Switch>
    </React.Suspense>
  );
};

export default Router;
