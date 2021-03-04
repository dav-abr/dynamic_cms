import * as router from "./router";
import apiSettings from "../config/api/settings.json";
import queryString from "query-string";

export default function actionHandler(type, options = {}, args = {}) {
  switch (type) {
    case "call":
      const { name, route } = options;
      const { search, params } = args;
      const settings = apiSettings[name];
      const routeSettings = apiSettings[name].routes[route];
      const baseURL = settings.baseURL;
      let routeURL = routeSettings.URL;
      const searchParams = queryString.stringify(search, {
        skipNull: true,
        skipEmptyString: true,
      });

      if (params) {
        for (const key of Object.keys(params)) {
          routeURL = routeURL.replace(`[${key}]`, params[key]);
        }
      }

      let callURL = baseURL + routeURL;

      if (searchParams) {
        callURL += "?" + searchParams;
      }

      const callParams = {
        method: routeSettings.method || "GET",
      };

      if (["POST", "PUT"].includes(routeSettings.method) && params?.body) {
        callParams.body = JSON.stringify(params.body);
      }

      return fetch(callURL, callParams).then((res) => {
        const { responseField } = routeSettings;
        if (responseField) {
          return res.json()[responseField];
        } else {
          return res.json();
        }
      });
      break;
    case "router":
      const { functionName } = options;
      if (router && router[functionName]) {
        return router[functionName](args);
      } else {
        return new Promise((resolve) => resolve({}));
      }
      break;
  }
}
