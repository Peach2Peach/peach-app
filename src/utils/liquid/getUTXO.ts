import { BLOCKEXPLORER_LIQUID } from "@env";
import { UTXO } from "../../../peach-api/src/@types/electrs-liquid";
import { getPublicHeaders } from "../../../peach-api/src/helpers/getPublicHeaders";
import { parseResponse } from "../../../peach-api/src/helpers/parseResponse";
import fetch from "../fetch";

type Props = {
  address: string;
};
export const getUTXO = async ({ address }: Props) => {
  const response = await fetch(
    `${BLOCKEXPLORER_LIQUID}/address/${address}/utxo`,
    {
      headers: getPublicHeaders(BLOCKEXPLORER_LIQUID),
      method: "GET",
    },
  );

  return parseResponse<UTXO[], APIError>(response);
};
