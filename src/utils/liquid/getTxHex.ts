import { BLOCKEXPLORER_LIQUID } from "@env";
import { getPublicHeaders } from "../../../peach-api/src/helpers/getPublicHeaders";
import { parseResponse } from "../../../peach-api/src/helpers/parseResponse";
import fetch from "../fetch";

type Props = {
  txId: string;
};
export const getTxHex = async ({ txId }: Props) => {
  const response = await fetch(`${BLOCKEXPLORER_LIQUID}/tx/${txId}/hex`, {
    headers: getPublicHeaders(BLOCKEXPLORER_LIQUID),
    method: "GET",
  });

  return parseResponse<string, APIError>(response, true);
};
