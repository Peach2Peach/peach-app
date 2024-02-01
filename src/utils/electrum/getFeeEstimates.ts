import { ESPLORA_URL } from "@env";
import fetch from "../fetch";
import { getPublicHeaders } from "../peachAPI/getPublicHeaders";
import { parseResponse } from "../peachAPI/parseResponse";

export const getFeeEstimates = async () => {
  const response = await fetch(`${ESPLORA_URL}/fee-estimates`, {
    headers: getPublicHeaders(),
    method: "GET",
  });

  return parseResponse<ConfirmationTargets>(response, "getFeeEstimates", false);
};
