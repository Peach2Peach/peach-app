import { BOLTZ_API } from "@env";
import { ReverseList } from "boltz-swap-web-context/src/boltz-api/types";
import { parseResponse } from "../../../../peach-api/src/helpers/parseResponse";
import fetch from "../../fetch";

export const getReverseSubmarineSwaps = async () => {
  const response = await fetch(`${BOLTZ_API}/v2/swap/reverse`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  return parseResponse<ReverseList, APIError>(response);
};
