/* eslint-disable no-magic-numbers */
import {
  mempoolUTXO,
  utxo,
} from "../../../tests/unit/data/liquidBlockExplorerData";
import { SATSINBTC } from "../../constants";
import { selectUTXONewestFirst } from "./selectUTXONewestFirst";

describe("selectUTXONewestFirst", () => {
  const utxo1 = {
    ...utxo,
    value: 10000,
    derivationPath: "path",
    status: {
      ...utxo.status,
      block_height: 2,
    },
  };
  const utxo2 = {
    ...utxo,
    value: 50000,
    derivationPath: "path",
    status: mempoolUTXO.status,
  };
  const utxo3 = {
    ...utxo,
    value: 123456,
    derivationPath: "path",
    status: {
      ...utxo.status,
      block_height: 1,
    },
  };
  it("should select utxo by newest first until desired amount is satisfied + fee buffer", () => {
    expect(selectUTXONewestFirst([utxo1, utxo2, utxo3], 5000)).toEqual([utxo2]);
    expect(selectUTXONewestFirst([utxo1, utxo2, utxo3], utxo2.value)).toEqual([
      utxo2,
      utxo1,
    ]);
    expect(selectUTXONewestFirst([utxo1, utxo2, utxo3], SATSINBTC)).toEqual([
      utxo2,
      utxo1,
      utxo3,
    ]);
  });
});
