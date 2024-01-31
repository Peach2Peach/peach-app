import { error } from "./log/error";
import { info } from "./log/info";
import { parseError } from "./result/parseError";

export default (url: RequestInfo, init?: RequestInit): Promise<Response> =>
  new Promise((resolve) =>
    fetch(url, init)
      .then((response) => {
        resolve(response);
        info(
          "fetch success",
          init?.method || "GET",
          response.status,
          response.statusText,
          url,
        );
      })
      .catch((err) => {
        const errorMessage = parseError(err);
        if (errorMessage === "Aborted") err.statusText = "Aborted";

        resolve(err);
        error(
          "fetch error",
          `${init?.method || "GET"} - ${err.status} - ${err.statusText} - ${url}`,
          errorMessage,
        );
      }),
  );
