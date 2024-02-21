import { BOLTZ_API } from "@env";
import { parseResponse } from "../../../../peach-api/src/helpers/parseResponse";
import fetch from "../../fetch";
import { ReverseRequest, ReverseResponse } from "./types";

export const postReverseSubmarineSwap = async (body: ReverseRequest) => {
  const response = await fetch(`${BOLTZ_API}/v2/swap/reverse`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body)
  });

  return parseResponse<ReverseResponse, APIError>(response)
};
