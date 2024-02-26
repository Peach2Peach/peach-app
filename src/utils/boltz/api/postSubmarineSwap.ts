import { BOLTZ_API } from "@env";
import {
  SubmarineRequest,
  SubmarineResponse
} from "boltz-swap-web-context/src/boltz-api/types";
import { parseResponse } from "../../../../peach-api/src/helpers/parseResponse";
import fetch from "../../fetch";

export type SubmarineAPIResponse = Omit<SubmarineResponse, "swapTree"> & {
  swapTree: {
    claimLeaf: { version: number; output: string };
    refundLeaf: { version: number; output: string };
  };
};
export const postSubmarineSwap = async (body: SubmarineRequest) => {
  const response = await fetch(`${BOLTZ_API}/v2/swap/submarine`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  });

  return parseResponse<SubmarineAPIResponse, APIError>(response);
};
