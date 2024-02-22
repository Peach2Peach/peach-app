import { mempoolUTXO, utxo } from "../../../tests/unit/data/blockExplorerData";
import { useLiquidWalletState } from "./useLiquidWalletState";

describe("useLiquidWalletState", () => {
  afterEach(() => {
    useLiquidWalletState.getState().reset();
  });
  it("returns defaults", () => {
    expect(useLiquidWalletState.getState()).toEqual({
      ...useLiquidWalletState.getState(),
      addresses: [],
      internalAddresses: [],
      utxos: [],
      balance: 0,
      isSynced: false,
    });
  });

  it("sets isSynced", () => {
    expect(useLiquidWalletState.getState().isSynced).toBeFalsy();
    useLiquidWalletState.getState().setIsSynced(true);
    expect(useLiquidWalletState.getState().isSynced).toBeTruthy();
  });
  it("sets addresses", () => {
    const addresses = ['address1', 'address2']
    expect(useLiquidWalletState.getState().addresses).toEqual([])
    useLiquidWalletState.getState().setAddresses(addresses);
    expect(useLiquidWalletState.getState().addresses).toEqual(addresses)
  });
  it("sets internal addresses", () => {
    const addresses = ['address1', 'address2']
    expect(useLiquidWalletState.getState().internalAddresses).toEqual([])
    useLiquidWalletState.getState().setInternalAddresses(addresses);
    expect(useLiquidWalletState.getState().internalAddresses).toEqual(addresses)
  });
  it("sets utxos", () => {
    const utxos = [utxo, mempoolUTXO]
    expect(useLiquidWalletState.getState().utxos).toEqual([])
    useLiquidWalletState.getState().setUTXO(utxos);
    expect(useLiquidWalletState.getState().utxos).toEqual(utxos)
  });
  it("sets balance", () => {
    const balance = 10000
    expect(useLiquidWalletState.getState().balance).toEqual(0)
    useLiquidWalletState.getState().setBalance(balance);
    expect(useLiquidWalletState.getState().balance).toEqual(balance)
  });
  it("doesn't persist isSynced", () => {
    expect(
      useLiquidWalletState.persist
        .getOptions()
        .partialize?.(useLiquidWalletState.getState()),
    ).not.toEqual(expect.objectContaining({ isSynced: expect.any(Boolean) }));
  });
});
