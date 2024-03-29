import { API_URL } from "@env";
import fetch from "../fetch";
import { getPublicHeaders } from "../peachAPI/getPublicHeaders";
import { parseResponse } from "../peachAPI/parseResponse";

export const generateBlock = async () => {
  const response = await fetch(`${API_URL}/v1/regtest/generateBlock`, {
    headers: getPublicHeaders(),
    method: "GET",
  });

  return parseResponse<GenerateBlockResponse>(response, "generateBlock");
};
