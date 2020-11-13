import * as router from "./router";

export default function actionHandler(type, options = {}, args = []) {
  switch (type) {
    case "call":
      break;
    case "router":
      const { functionName } = options;
      if (router && router[functionName]) {
        console.log("router", { type, options, args });
        return router[functionName](...args);
      } else {
        return new Promise((resolve) => resolve({}));
      }
      break;
  }
}
