import { renderHook, waitFor } from "test-utils";
import { liquidAddresses } from "../../../tests/unit/data/liquidNetworkData";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import {
  addressScriptPubKeyMock,
  walletIsMineMock,
} from "../../../tests/unit/mocks/bdkRN";
import { PeachLiquidJSWallet } from "../../utils/wallet/PeachLiquidJSWallet";
import { PeachWallet } from "../../utils/wallet/PeachWallet";
import { getLiquidNetwork } from "../../utils/wallet/getLiquidNetwork";
import { setLiquidWallet, setPeachWallet } from "../../utils/wallet/setWallet";
import { useAreMyAddresses, useIsMyAddress } from "./useIsMyAddress";

describe("useIsMyAddress", () => {
  const wallet = createTestWallet();
  const peachWallet = new PeachWallet({ wallet });
  const peachLiquidWallet = new PeachLiquidJSWallet({
    wallet,
    network: getLiquidNetwork(),
  });

  beforeEach(async () => {
    setPeachWallet(peachWallet);
    await peachWallet.initWallet();
    setLiquidWallet(peachLiquidWallet);
  });
  it("should return true if address belong to wallet", async () => {
    const scriptPubKey = "scriptPubKey";
    const address = sellOffer.returnAddress;
    addressScriptPubKeyMock.mockResolvedValueOnce(scriptPubKey);
    walletIsMineMock.mockResolvedValue(true);

    const { result } = renderHook(useIsMyAddress, {
      initialProps: { address, chain: "bitcoin" },
    });
    await waitFor(() => expect(result.current).toEqual(true));
  });
  it("should return false if address does not belong to wallet", async () => {
    const scriptPubKey = "scriptPubKey";
    const address = sellOffer.returnAddress;
    addressScriptPubKeyMock.mockResolvedValueOnce(scriptPubKey);
    walletIsMineMock.mockResolvedValue(false);

    const { result } = renderHook(useIsMyAddress, {
      initialProps: { address, chain: "bitcoin" },
    });
    await waitFor(() => expect(result.current).toEqual(false));
  });
  it("should return true if address belong to liquid wallet", async () => {
    const address = peachLiquidWallet.getAddress(0).address;
    const { result } = renderHook(useIsMyAddress, {
      initialProps: { address, chain: "liquid" },
    });
    await waitFor(() => expect(result.current).toEqual(true));
  });
  it("should return false if address does not belong to liquid wallet", async () => {
    const address = liquidAddresses.regtest[0];
    const { result } = renderHook(useIsMyAddress, {
      initialProps: { address, chain: "liquid" },
    });
    await waitFor(() => expect(result.current).toEqual(false));
  });
});

describe("useAreMyAddresses", () => {
  const wallet = createTestWallet();
  const peachWallet = new PeachWallet({ wallet });
  const peachLiquidWallet = new PeachLiquidJSWallet({
    wallet,
    network: getLiquidNetwork(),
  });

  beforeEach(async () => {
    setPeachWallet(peachWallet);
    await peachWallet.initWallet();
    setLiquidWallet(peachLiquidWallet);
  });
  it("should return true if address belong to wallet", async () => {
    const scriptPubKey = "scriptPubKey";
    const addresses = [sellOffer.returnAddress];
    addressScriptPubKeyMock.mockResolvedValueOnce(scriptPubKey);
    walletIsMineMock.mockResolvedValue(true);

    const { result } = renderHook(useAreMyAddresses, {
      initialProps: { addresses, chain: "bitcoin" },
    });
    await waitFor(() => expect(result.current).toEqual([true]));
  });
  it("should return false if address does not belong to wallet", async () => {
    const scriptPubKey = "scriptPubKey";
    const addresses = [sellOffer.returnAddress];
    addressScriptPubKeyMock.mockResolvedValueOnce(scriptPubKey);
    walletIsMineMock.mockResolvedValue(false);

    const { result } = renderHook(useAreMyAddresses, {
      initialProps: { addresses, chain: "bitcoin" },
    });
    await waitFor(() => expect(result.current).toEqual([false]));
  });
  it("should return true if address belong to liquid wallet", async () => {
    const addresses = [peachLiquidWallet.getAddress(0).address];
    const { result } = renderHook(useAreMyAddresses, {
      initialProps: { addresses, chain: "liquid" },
    });
    await waitFor(() => expect(result.current).toEqual([true]));
  });
  it("should return false if address does not belong to liquid wallet", async () => {
    const addresses = liquidAddresses.regtest;
    const { result } = renderHook(useAreMyAddresses, {
      initialProps: { addresses, chain: "liquid" },
    });
    await waitFor(() =>
      expect(result.current).toEqual([false, false, false, false]),
    );
  });
});
