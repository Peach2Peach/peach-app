import { BOLTZ_API } from "@env";
import {
  ReverseRequest,
  ReverseResponse,
} from "boltz-swap-web-context/src/boltz-api/types";
import { parseResponse } from "../../../../peach-api/src/helpers/parseResponse";
import fetch from "../../fetch";

export type ReverseAPIResponse = Omit<ReverseResponse, "swapTree"> & {
  swapTree?: {
    claimLeaf: { version: number; output: string };
    refundLeaf: { version: number; output: string };
  };
};
export const postReverseSubmarineSwap = async (body: ReverseRequest) => {
  const response = await fetch(`${BOLTZ_API}/v2/swap/reverse`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  });

  return parseResponse<ReverseAPIResponse, APIError>(response);
};
