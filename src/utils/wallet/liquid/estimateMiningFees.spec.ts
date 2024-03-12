/* eslint-disable no-magic-numbers */
import { networks } from "liquidjs-lib";
import {
  mempoolUTXO,
  utxo,
} from "../../../../tests/unit/data/liquidBlockExplorerData";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { getError } from "../../../../tests/unit/helpers/getError";
import { PeachLiquidJSWallet } from "../PeachLiquidJSWallet";
import { clearPeachLiquidWallet, setLiquidWallet } from "../setWallet";
import { useLiquidWalletState } from "../useLiquidWalletState";
import { DUST_LIMIT } from "./constants";
import { estimateMiningFees } from "./estimateMiningFees";

describe("estimateMiningFees", () => {
  const props = {
    amount: 100000,
    feeRate: 21,
    inputs: [utxo].map((u) => ({ ...u, derivationPath: "m/84'/1'/0'/0/0" })),
  };

  beforeEach(() => {
    useLiquidWalletState.getState().reset();
    const peachWallet = new PeachLiquidJSWallet({
      network: networks.regtest,
      wallet: createTestWallet(),
    });
    setLiquidWallet(peachWallet);
  });

  it("should throw an error if wallet is not ready", async () => {
    clearPeachLiquidWallet();
    const error = await getError<Error>(() => estimateMiningFees(props));
    expect(error.message).toBe("WALLET_NOT_READY");
  });
  it("should throw if funds are insufficient", async () => {
    const error = await getError<Error>(() =>
      estimateMiningFees({
        ...props,
        amount: utxo.value + 1,
      }),
    );
    expect(error.message).toBe(
      "InsufficientFunds: Insufficient funds: 200000 sat available of 200001 sat needed",
    );
  });
  it("should throw if amount below dust limit", async () => {
    const error = await getError<Error>(() =>
      estimateMiningFees({ ...props, amount: DUST_LIMIT - 1 }),
    );
    expect(error.message).toBe("BELOW_DUST_LIMIT");
  });
  it("returns estimated mining fees and sendable amount", () => {
    const { miningFees, sendableAmount } = estimateMiningFees(props);
    expect(miningFees).toEqual(5628);
    expect(sendableAmount).toEqual(194372);
  });
  it("returns estimated mining fees and sendable amount with multiple inputs", () => {
    const { miningFees, sendableAmount } = estimateMiningFees({
      ...props,
      inputs: [utxo, mempoolUTXO].map((u) => ({
        ...u,
        derivationPath: "m/84'/1'/0'/0/0",
      })),
    });
    expect(miningFees).toEqual(7056);
    expect(sendableAmount).toEqual(222944);
  });
  it("returns estimated mining fees and sendable amount without change if below the dust limit", () => {
    const { miningFees, sendableAmount } = estimateMiningFees({
      ...props,
      amount: utxo.value - DUST_LIMIT,
    });
    expect(miningFees).toEqual(4221);
    expect(sendableAmount).toEqual(195779);
  });
});
