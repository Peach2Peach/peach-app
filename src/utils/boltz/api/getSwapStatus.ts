import { BOLTZ_API } from "@env";
import { SwapStatus } from "boltz-swap-web-context/src/boltz-api/types";
import { parseResponse } from "../../../../peach-api/src/helpers/parseResponse";
import fetch from "../../fetch";

type Props = {
  id: string;
};
export const getSwapStatus = async ({ id }: Props) => {
  const response = await fetch(`${BOLTZ_API}/v2/swap/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  return parseResponse<SwapStatus, APIError>(response);
};
