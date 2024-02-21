import { networks } from "liquidjs-lib";
import { account1 } from "../../../tests/unit/data/accountData";
import { getError } from "../../../tests/unit/helpers/getError";
import { useAccountStore } from "../account/account";
import { PeachLiquidJSWallet } from "./PeachLiquidJSWallet";
import { createWalletFromBase58 } from "./createWalletFromBase58";
import { getNetwork } from "./getNetwork";
import { useLiquidWalletState } from "./useLiquidWalletState";

// eslint-disable-next-line max-lines-per-function
describe("PeachLiquidJSWallet", () => {
  const wallet = createWalletFromBase58(account1.base58, getNetwork());
  const message = "message";
  let peachJSWallet: PeachLiquidJSWallet;

  beforeEach(() => {
    useAccountStore.getState().setAccount(account1);
    peachJSWallet = new PeachLiquidJSWallet({ wallet });
  });
  afterEach(() => {
    useLiquidWalletState.getState().reset();
  });

  it("instantiates", () => {
    const addresses = ["address1", "address2"];
    useLiquidWalletState.getState().setAddresses(addresses);

    peachJSWallet = new PeachLiquidJSWallet({ wallet });

    expect(peachJSWallet.jsWallet).toEqual(wallet);
    expect(peachJSWallet.derivationPath).toEqual("m/49'/0'/0'");
    expect(peachJSWallet.addresses).toBe(addresses);
  });
  it("instantiates for mainnet", () => {
    peachJSWallet = new PeachLiquidJSWallet({
      wallet,
      network: networks.liquid,
    });

    expect(peachJSWallet.jsWallet).toEqual(wallet);
    expect(peachJSWallet.derivationPath).toEqual("m/49'/0'/0'");
  });

  it("finds key pair by address and stores scanned addresses", () => {
    const addressIndex = 3;
    const address = peachJSWallet.getAddress(addressIndex);

    if (!address) throw Error();
    const keyPair = peachJSWallet.findKeyPairByAddress(address);
    expect(keyPair?.publicKey.toString("hex")).toBe(
      "0232e747d9af0ffde3c8343264cec29569f950620f3c263f364ba3b23e09cb045e",
    );
    expect(peachJSWallet.addresses).toEqual([
      "ex1qtznn7c8hfzpr4us5aymcfwfwk2p53xqg87hd5e",
      "ex1qv9463g64c2e0aslz0d5f4r0uq64pxm63s52ghw",
      "ex1q6ylwwkn3k5e8xncks4jcdf7z0gge2wh9q4eadn",
      "ex1qkc2val68mgnfsu2ccls9wl7z80382366pt3hya",
    ]);
  });

  it("signs an arbitrary message", () => {
    const address = "ex1qtznn7c8hfzpr4us5aymcfwfwk2p53xqg87hd5e";
    const signature = peachJSWallet.signMessage(message, address);
    // eslint-disable-next-line max-len
    expect(signature).toBe(
      "AkgwRQIhANLsNrqf6mEdi9/1bP1FvzZauDKfvnrFr5ZYyLZlx1yDAiAp6KSvW1ozHKmMj6scf6S1wQw0pUOl+JG++BeE/TYViwEhA5rsQTOPc8x49uK4N6dhtU16Qb2KvXKKMoywMqJ47/YR",
    );
  });
  it("signs an arbitrary message with index", () => {
    const address = "ex1qtznn7c8hfzpr4us5aymcfwfwk2p53xqg87hd5e";
    const findKeyPairByAddressSpy = jest.spyOn(
      peachJSWallet,
      "findKeyPairByAddress",
    );
    const signature = peachJSWallet.signMessage(message, address, 0);
    expect(findKeyPairByAddressSpy).not.toHaveBeenCalled();
    // eslint-disable-next-line max-len
    expect(signature).toBe(
      "AkgwRQIhANLsNrqf6mEdi9/1bP1FvzZauDKfvnrFr5ZYyLZlx1yDAiAp6KSvW1ozHKmMj6scf6S1wQw0pUOl+JG++BeE/TYViwEhA5rsQTOPc8x49uK4N6dhtU16Qb2KvXKKMoywMqJ47/YR",
    );
  });

  it("throws an error if address is not part of wallet", async () => {
    const address = "bcrt1qdoesnotexist";
    const error = await getError<Error>(() =>
      peachJSWallet.signMessage(message, address),
    );
    expect(error.message).toBe("Address not part of wallet");
  });
});
