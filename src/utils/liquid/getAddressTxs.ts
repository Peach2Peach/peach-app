import { BLOCKEXPLORER_LIQUID } from "@env";
import { Transaction } from "../../../peach-api/src/@types/electrs-liquid";
import { getPublicHeaders } from "../../../peach-api/src/helpers/getPublicHeaders";
import { parseResponse } from "../../../peach-api/src/helpers/parseResponse";

type Props = {
  address: string;
};
export const getAddressTxs = async ({ address }: Props) => {
  const response = await fetch(
    `${BLOCKEXPLORER_LIQUID}/address/${address}/txs`,
    {
      headers: getPublicHeaders(BLOCKEXPLORER_LIQUID),
      method: "GET",
    },
  );

  return parseResponse<Transaction[], APIError>(response);
};
