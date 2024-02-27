import { networks } from "liquidjs-lib";
import { getResult } from "../../../peach-api/src/utils/result";
import { account1 } from "../../../tests/unit/data/accountData";
import { mempoolUTXO, utxo } from "../../../tests/unit/data/liquidBlockExplorerData";
import { getError } from "../../../tests/unit/helpers/getError";
import { useAccountStore } from "../account/account";
import { omit } from "../object/omit";
import { PeachLiquidJSWallet } from "./PeachLiquidJSWallet";
import { createWalletFromBase58 } from "./createWalletFromBase58";
import { getNetwork } from "./getNetwork";
import { useLiquidWalletState } from "./useLiquidWalletState";

jest.mock("../liquid/getUTXO");
let addressesWithCoin = 30
const getUTXOMock = jest.requireMock("../liquid/getUTXO").getUTXO.mockImplementation(() => {
  addressesWithCoin--
  if (addressesWithCoin >= 0) return getResult([utxo])
  return getResult([])
})

describe("PeachLiquidJSWallet", () => {
  const wallet = createWalletFromBase58(account1.base58, getNetwork());
  const message = "message";
  let peachLiquidJSWallet: PeachLiquidJSWallet;

  beforeEach(() => {
    useLiquidWalletState.getState().reset();
    useAccountStore.getState().setAccount(account1);
    peachLiquidJSWallet = new PeachLiquidJSWallet({ wallet });
  });
  afterEach(()=> {
    useLiquidWalletState.getState().reset();
    // eslint-disable-next-line no-magic-numbers
    addressesWithCoin = 30
  })

  it("instantiates", () => {
    const addresses = ["address1", "address2"];
    useLiquidWalletState.getState().setAddresses(addresses);

    peachLiquidJSWallet = new PeachLiquidJSWallet({ wallet });

    expect(peachLiquidJSWallet.jsWallet).toEqual(wallet);
    expect(peachLiquidJSWallet.derivationPath).toEqual("m/49'/0'/0'");
    expect(peachLiquidJSWallet.addresses).toBe(addresses);
  });
  it("instantiates for mainnet", () => {
    peachLiquidJSWallet = new PeachLiquidJSWallet({
      wallet,
      network: networks.liquid,
    });

    expect(peachLiquidJSWallet.jsWallet).toEqual(wallet);
    expect(peachLiquidJSWallet.derivationPath).toEqual("m/49'/0'/0'");
  });
  it("syncs wallet", async () => {
    const expectedUTXOs = 30
    const syncInProgress = peachLiquidJSWallet.syncWallet()
    expect(peachLiquidJSWallet.syncInProgress).toBeDefined()
    await syncInProgress;
    expect(peachLiquidJSWallet.syncInProgress).toBeUndefined()
    expect(peachLiquidJSWallet.utxos).toHaveLength(expectedUTXOs)
    expect(peachLiquidJSWallet.utxos.map(u => omit(u, 'derivationPath'))).toEqual(new Array(expectedUTXOs).fill(utxo))
    expect(peachLiquidJSWallet.utxos[0].derivationPath).toBe("m/49'/0'/0'/0/0")
    expect(peachLiquidJSWallet.utxos[9].derivationPath).toBe("m/49'/0'/0'/1/4")
    expect(peachLiquidJSWallet.utxos[17].derivationPath).toBe("m/49'/0'/0'/1/8")
    expect(peachLiquidJSWallet.getBalance()).toEqual({
      "confirmed": 6000000,
      "spendable": 6000000,
      "total": 6000000,
      "trustedPending": 0,
      "untrustedPending": 0,
    })
  });
  it("waits for already running sync", async () => {
    const expectedUTXOs = 60
    jest.clearAllMocks();
    const delay = 100;
    const promise = new Promise((resolve) => setTimeout(()=> resolve(getResult([utxo])), delay));
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
    useLiquidWalletState.getState().setUTXO([utxo, mempoolUTXO].map(utx => ({...utx, derivationPath: '1'})))
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
    expect(address).toBe("ex1qtznn7c8hfzpr4us5aymcfwfwk2p53xqg87hd5e");
    expect(address2).toBe("ex1qv9463g64c2e0aslz0d5f4r0uq64pxm63s52ghw");
    expect(address3).toBe("ex1q6ylwwkn3k5e8xncks4jcdf7z0gge2wh9q4eadn");
  });
  it("gets an address by index", () => {
    const addressIndex = 3;
    const { address } = peachLiquidJSWallet.getAddress(addressIndex);

    if (!address) throw Error();
    expect(address).toBe("ex1qkc2val68mgnfsu2ccls9wl7z80382366pt3hya");
  });
  it("finds key pair by address and stores scanned addresses", () => {
    const addressIndex = 3;
    const { address } = peachLiquidJSWallet.getAddress(addressIndex);

    if (!address) throw Error();
    const keyPair = peachLiquidJSWallet.findKeyPairByAddress(address);
    expect(keyPair?.publicKey.toString("hex")).toBe(
      "0232e747d9af0ffde3c8343264cec29569f950620f3c263f364ba3b23e09cb045e",
    );
    expect(peachLiquidJSWallet.addresses).toEqual([
      "ex1qtznn7c8hfzpr4us5aymcfwfwk2p53xqg87hd5e",
      "ex1qv9463g64c2e0aslz0d5f4r0uq64pxm63s52ghw",
      "ex1q6ylwwkn3k5e8xncks4jcdf7z0gge2wh9q4eadn",
      "ex1qkc2val68mgnfsu2ccls9wl7z80382366pt3hya",
    ]);
  });
  it("gets a new internal address", () => {
    const { address } = peachLiquidJSWallet.getInternalAddress();
    const { address: address2 } = peachLiquidJSWallet.getInternalAddress();
    const { address: address3 } = peachLiquidJSWallet.getInternalAddress();
    expect(address).toBe("ex1qzql0dtxtunjhtephvfvaywum34p8eu7pmq8dk6");
    expect(address2).toBe("ex1qsddl3lvt568gg6ppxcnynj8fnmw90galc4jw9g");
    expect(address3).toBe("ex1q350m9uq0z2jgxgm9ymlugjj6ey79k55xj97cxx");
  });
  it("gets an internal address by index", () => {
    const addressIndex = 3;
    const { address } = peachLiquidJSWallet.getInternalAddress(addressIndex);

    if (!address) throw Error();
    expect(address).toBe("ex1qczr0spjq8ws09ptp3zwdh6kx4l3hcmyfj8vwhh");
  });

  it("signs an arbitrary message", () => {
    const address = "ex1qtznn7c8hfzpr4us5aymcfwfwk2p53xqg87hd5e";
    const signature = peachLiquidJSWallet.signMessage(message, address);
    // eslint-disable-next-line max-len
    expect(signature).toBe(
      "AkgwRQIhANLsNrqf6mEdi9/1bP1FvzZauDKfvnrFr5ZYyLZlx1yDAiAp6KSvW1ozHKmMj6scf6S1wQw0pUOl+JG++BeE/TYViwEhA5rsQTOPc8x49uK4N6dhtU16Qb2KvXKKMoywMqJ47/YR",
    );
  });
  it("signs an arbitrary message with index", () => {
    const address = "ex1qtznn7c8hfzpr4us5aymcfwfwk2p53xqg87hd5e";
    const findKeyPairByAddressSpy = jest.spyOn(
      peachLiquidJSWallet,
      "findKeyPairByAddress",
    );
    const signature = peachLiquidJSWallet.signMessage(message, address, 0);
    expect(findKeyPairByAddressSpy).not.toHaveBeenCalled();
    // eslint-disable-next-line max-len
    expect(signature).toBe(
      "AkgwRQIhANLsNrqf6mEdi9/1bP1FvzZauDKfvnrFr5ZYyLZlx1yDAiAp6KSvW1ozHKmMj6scf6S1wQw0pUOl+JG++BeE/TYViwEhA5rsQTOPc8x49uK4N6dhtU16Qb2KvXKKMoywMqJ47/YR",
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
