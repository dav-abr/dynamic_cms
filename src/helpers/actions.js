import * as router from "./router";
import apiSettings from "../config/api/settings.json";
import queryString from "query-string";
import { notification } from "antd";

export default function actionHandler(type, options = {}, args = {}) {
  const { params = {} } = args;

  switch (type) {
    case "call":
      const { name, route } = options;
      const { search = {} } = args;
      let { pagination = {} } = args;
      const settings = apiSettings[name];
      const routeSettings = apiSettings[name].routes[route] || {};
      const baseURL = settings.baseURL;
      let routeURL = routeSettings.URL;

      if (routeSettings.pagination) {
        pagination = {
          [routeSettings.pagination.page]: pagination.page,
          [routeSettings.pagination.size]: pagination.size,
        };
      }

      const urlParams = queryString.stringify(
        { ...search, ...pagination },
        {
          skipNull: true,
          skipEmptyString: true,
        }
      );

      if (params) {
        for (const key of Object.keys(params)) {
          routeURL = routeURL.replace(`[${key}]`, params[key]);
        }
      }

      let callURL = baseURL + routeURL;

      if (urlParams) {
        callURL += "?" + urlParams;
      }

      const callParams = {
        method: routeSettings.method || "GET",
        headers: routeSettings.headers || {},
      };

      if (["POST", "PUT"].includes(routeSettings.method) && params?.body) {
        callParams.body = JSON.stringify(params.body);
      }

      return new Promise((resolve, reject) => {
        fetch(callURL, callParams)
          .then(async (res) => {
            const { responseField } = routeSettings;

            return {
              res,
              data: responseField
                ? await res.json()[responseField]
                : await res.json(),
            };
          })
          .then(({ data, res }) => {
            const { mapHeadersToResponse } = routeSettings;
            const response = {
              body: data,
            };

            if (mapHeadersToResponse) {
              for (const key in mapHeadersToResponse) {
                response[mapHeadersToResponse[key]] = res.headers.get(key);
              }
            }

            return resolve(response);
          })
          .catch((err) => {
            notification.error({
              message: "Error",
              description: err.message,
            });

            return reject(err);
          });
      });
    case "navigate":
      return args.params.history.push(
        options.url.replace(
          /\[\w+\]/gm,
          (match) => params[match.slice(1, match.length - 1)] || ""
        )
      );
    case "router":
      const { functionName } = options;
      if (router && router[functionName]) {
        return router[functionName](args);
      } else {
        return new Promise((resolve) => resolve({}));
      }
    case "debug":
      console.log(type, args);
      break;
  }
}
