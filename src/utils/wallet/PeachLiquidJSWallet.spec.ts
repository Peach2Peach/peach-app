/* eslint-disable no-magic-numbers */
import { networks } from "liquidjs-lib";
import { getResult } from "../../../peach-api/src/utils/result";
import { account1 } from "../../../tests/unit/data/accountData";
import {
  mempoolUTXO,
  utxo,
} from "../../../tests/unit/data/liquidBlockExplorerData";
import { getError } from "../../../tests/unit/helpers/getError";
import { useAccountStore } from "../account/account";
import { omit } from "../object/omit";
import { PeachLiquidJSWallet } from "./PeachLiquidJSWallet";
import { createWalletFromBase58 } from "./createWalletFromBase58";
import { getNetwork } from "./getNetwork";
import { useLiquidWalletState } from "./useLiquidWalletState";

jest.mock("../liquid/getUTXO");
const coinsBetween = [0, 15];
const coinsBetween2 = [30, 44];
let i = 0;
const getUTXOMock = jest
  .requireMock("../liquid/getUTXO")
  .getUTXO.mockImplementation(() => {
    i++;
    if (i >= coinsBetween[0] && i <= coinsBetween[1]) return getResult([utxo]);
    if (i >= coinsBetween2[0] && i <= coinsBetween2[1])
      return getResult([utxo]);
    return getResult([]);
  });

describe("PeachLiquidJSWallet", () => {
  const wallet = createWalletFromBase58(account1.base58, getNetwork());
  const message = "message";
  let peachLiquidJSWallet: PeachLiquidJSWallet;

  beforeEach(() => {
    useLiquidWalletState.getState().reset();
    useAccountStore.getState().setAccount(account1);
    peachLiquidJSWallet = new PeachLiquidJSWallet({ wallet });
  });
  afterEach(() => {
    useLiquidWalletState.getState().reset();
    i = 0;
  });

  it("instantiates", () => {
    const addresses = ["address1", "address2"];
    useLiquidWalletState.getState().setAddresses(addresses);

    peachLiquidJSWallet = new PeachLiquidJSWallet({
      wallet,
      network: networks.testnet,
    });

    expect(peachLiquidJSWallet.jsWallet).toEqual(wallet);
    expect(peachLiquidJSWallet.derivationPath).toEqual("m/84'/1'/0'");
    expect(peachLiquidJSWallet.addresses).toBe(addresses);
  });
  it("instantiates for mainnet", () => {
    peachLiquidJSWallet = new PeachLiquidJSWallet({
      wallet,
      network: networks.liquid,
    });

    expect(peachLiquidJSWallet.jsWallet).toEqual(wallet);
    expect(peachLiquidJSWallet.derivationPath).toEqual("m/84'/0'/0'");
  });
  it("syncs wallet", async () => {
    const expectedUTXOs = 30;
    const syncInProgress = peachLiquidJSWallet.syncWallet();
    expect(peachLiquidJSWallet.syncInProgress).toBeDefined();
    await syncInProgress;
    expect(peachLiquidJSWallet.syncInProgress).toBeUndefined();
    expect(peachLiquidJSWallet.utxos).toHaveLength(expectedUTXOs);
    expect(
      peachLiquidJSWallet.utxos.map((u) => omit(u, "derivationPath")),
    ).toEqual(new Array(expectedUTXOs).fill(utxo));
    expect(peachLiquidJSWallet.utxos[0].derivationPath).toBe("m/84'/0'/0'/0/0");
    expect(peachLiquidJSWallet.utxos[9].derivationPath).toBe("m/84'/0'/0'/0/9");
    expect(peachLiquidJSWallet.utxos[29].derivationPath).toBe(
      "m/84'/0'/0'/1/14",
    );
    expect(peachLiquidJSWallet.getBalance()).toEqual({
      confirmed: 6000000,
      spendable: 6000000,
      total: 6000000,
      trustedPending: 0,
      untrustedPending: 0,
    });
  });
  it("waits for already running sync", async () => {
    const expectedUTXOs = 59;
    jest.clearAllMocks();
    const delay = 100;
    const promise = new Promise((resolve) =>
      setTimeout(() => resolve(getResult([utxo])), delay),
    );
    getUTXOMock.mockReturnValueOnce(promise);
    expect(peachLiquidJSWallet.syncInProgress).toBeUndefined();
    peachLiquidJSWallet.syncWallet();
    expect(peachLiquidJSWallet.syncInProgress).not.toBeUndefined();
    peachLiquidJSWallet.syncWallet();
    jest.runAllTimers();
    await peachLiquidJSWallet.syncInProgress;
    expect(peachLiquidJSWallet.syncInProgress).toBeUndefined();
    expect(getUTXOMock).toHaveBeenCalledTimes(expectedUTXOs);
  });
  it("calculates balance", () => {
    useLiquidWalletState
      .getState()
      .setUTXO(
        [utxo, mempoolUTXO].map((utx) => ({ ...utx, derivationPath: "1" })),
      );
    expect(peachLiquidJSWallet.getBalance()).toEqual({
      trustedPending: 0,
      untrustedPending: 30000,
      confirmed: 200000,
      spendable: 230000,
      total: 230000,
    });
  });
  it("gets a new address", () => {
    const { address } = peachLiquidJSWallet.getAddress();
    const { address: address2 } = peachLiquidJSWallet.getAddress();
    const { address: address3 } = peachLiquidJSWallet.getAddress();
    expect(address).toBe("ex1qcslk785zp5xqj5kjdawegsjglm039w56xzvqsh");
    expect(address2).toBe("ex1qm6df88c6uaqrd565dcswfmuue7s9skym5g8yfq");
    expect(address3).toBe("ex1q4uan5308xusfq7aqzjmwmpyjtj85sdwv0599e6");
  });
  it("checks addresses for being used", () => {
    const { address } = peachLiquidJSWallet.getAddress();
    expect(peachLiquidJSWallet.isAddressUsed(address)).toBeFalsy();
    useLiquidWalletState.getState().setAddressUsed(address);
    expect(peachLiquidJSWallet.isAddressUsed(address)).toBeTruthy();
  });
  it("gets an address by index", () => {
    const addressIndex = 3;
    const { address } = peachLiquidJSWallet.getAddress(addressIndex);

    if (!address) throw Error();
    expect(address).toBe("ex1qht934aen9x48fvuq08rgrhtxs8jecklqdxmc9a");
  });
  it("finds key pair by address and stores scanned addresses", () => {
    const addressIndex = 3;
    const { address } = peachLiquidJSWallet.getAddress(addressIndex);

    if (!address) throw Error();
    const keyPair = peachLiquidJSWallet.findKeyPairByAddress(address);
    expect(keyPair?.publicKey.toString("hex")).toBe(
      "02cea67ce6aa1b6d0e7640568cc0aeb0b94a92c8b21735f8fb8d66041c449929a3",
    );
    expect(peachLiquidJSWallet.addresses).toEqual([
      "ex1qcslk785zp5xqj5kjdawegsjglm039w56xzvqsh",
      "ex1qm6df88c6uaqrd565dcswfmuue7s9skym5g8yfq",
      "ex1q4uan5308xusfq7aqzjmwmpyjtj85sdwv0599e6",
      "ex1qht934aen9x48fvuq08rgrhtxs8jecklqdxmc9a",
    ]);
  });
  it("gets a new internal address", () => {
    const { address } = peachLiquidJSWallet.getInternalAddress();
    const { address: address2 } = peachLiquidJSWallet.getInternalAddress();
    const { address: address3 } = peachLiquidJSWallet.getInternalAddress();
    expect(address).toBe("ex1q5m2vn958vgn2v4avemxqr8n35dnky04umnjeek");
    expect(address2).toBe("ex1q4xcnnq4jaqwhxgc7pnvplwe78espqgeafvlpfw");
    expect(address3).toBe("ex1q4rexatnzc5g7u4kk078m6q8wuv7nqxxkvjfcsu");
  });
  it("gets an internal address by index", () => {
    const addressIndex = 3;
    const { address } = peachLiquidJSWallet.getInternalAddress(addressIndex);

    if (!address) throw Error();
    expect(address).toBe("ex1q4xcnnq4jaqwhxgc7pnvplwe78espqgeafvlpfw");
  });

  it("signs an arbitrary message", () => {
    const address = "ex1qcslk785zp5xqj5kjdawegsjglm039w56xzvqsh";
    const signature = peachLiquidJSWallet.signMessage(message, address);
    // eslint-disable-next-line max-len
    expect(signature).toBe(
      "AkgwRQIhAMT8IZ7R7OOWm7mZf2xfXOatSuguIt0/inVgqwKuGhzmAiAmJ8gIbyOrmPhQu//Fv0fs0jGmd1vreQ4fmKgCx4vbXAEhAlDj2lYviHyAR0fUlMG6GqHmR9i2+n7fVSFZ7LRJ9cxJ",
    );
  });
  it("signs an arbitrary message with index", () => {
    const address = "ex1qcslk785zp5xqj5kjdawegsjglm039w56xzvqsh";
    const findKeyPairByAddressSpy = jest.spyOn(
      peachLiquidJSWallet,
      "findKeyPairByAddress",
    );
    const signature = peachLiquidJSWallet.signMessage(message, address, 0);
    expect(findKeyPairByAddressSpy).not.toHaveBeenCalled();
    // eslint-disable-next-line max-len
    expect(signature).toBe(
      "AkgwRQIhAMT8IZ7R7OOWm7mZf2xfXOatSuguIt0/inVgqwKuGhzmAiAmJ8gIbyOrmPhQu//Fv0fs0jGmd1vreQ4fmKgCx4vbXAEhAlDj2lYviHyAR0fUlMG6GqHmR9i2+n7fVSFZ7LRJ9cxJ",
    );
  });

  it("throws an error if address is not part of wallet", async () => {
    const address = "bcrt1qdoesnotexist";
    const error = await getError<Error>(() =>
      peachLiquidJSWallet.signMessage(message, address),
    );
    expect(error.message).toBe("Address not part of wallet");
  });
});
