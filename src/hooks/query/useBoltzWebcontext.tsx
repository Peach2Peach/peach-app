import { API_URL } from "@env";
import { useQuery } from "@tanstack/react-query";
import fetch from "../../utils/fetch";

export const useBoltzWebcontext = () =>
  useQuery({
    queryKey: ["boltz", "webcontext"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/v1/boltz`, {
        method: "GET",
        headers: {
          Accept: "text/html",
          "Content-Type": "text/html",
        },
      });
      const html = await response.text();

      if (!html) throw Error("NETWORK_ERROR");
      return html;
    },
    staleTime: Infinity,
  });
