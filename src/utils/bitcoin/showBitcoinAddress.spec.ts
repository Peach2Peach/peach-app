import { networks } from "bitcoinjs-lib";
import { Linking } from "react-native";
import { showBitcoinAddress } from "./showBitcoinAddress";

describe("showBitcoinAddress", () => {
  const openURLSpy = jest.spyOn(Linking, "openURL");

  it("links to mainnet blockexplorer", async () => {
    await showBitcoinAddress("address", networks.bitcoin);
    expect(openURLSpy).toHaveBeenCalledWith(
      "https://mempool.space/address/address",
    );
  });
  it("links to testnet blockexplorer", async () => {
    await showBitcoinAddress("address", networks.testnet);
    expect(openURLSpy).toHaveBeenCalledWith(
      "https://mempool.space/testnet/address/address",
    );
  });
  it("links to regtest blockexplorer", async () => {
    await showBitcoinAddress("address", networks.regtest);
    expect(openURLSpy).toHaveBeenCalledWith(
      "https://localhost:3000/address/address",
    );
  });
});
