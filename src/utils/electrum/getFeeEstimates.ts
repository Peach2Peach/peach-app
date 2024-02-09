import { BLOCKEXPLORER } from "@env";
import fetch from "../fetch";
import { getPublicHeaders } from "../peachAPI/getPublicHeaders";
import { parseResponse } from "../peachAPI/parseResponse";

export const getFeeEstimates = async () => {
  const response = await fetch(`${BLOCKEXPLORER}/fee-estimates`, {
    headers: getPublicHeaders(),
    method: "GET",
  });

  return parseResponse<ConfirmationTargets>(response, "getFeeEstimates", false);
};
