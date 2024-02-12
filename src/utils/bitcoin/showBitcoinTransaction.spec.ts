import { networks } from "bitcoinjs-lib";
import { Linking } from "react-native";
import { showBitcoinTransaction } from "./showBitcoinTransaction";

describe("showBitcoinTransaction", () => {
  const openURLSpy = jest.spyOn(Linking, "openURL");

  it("links to mainnet blockexplorer", async () => {
    await showBitcoinTransaction("txId", networks.bitcoin);
    expect(openURLSpy).toHaveBeenCalledWith("https://mempool.space/tx/txId");
  });
  it("links to testnet blockexplorer", async () => {
    await showBitcoinTransaction("txId", networks.testnet);
    expect(openURLSpy).toHaveBeenCalledWith(
      "https://mempool.space/testnet/tx/txId",
    );
  });
  it("links to regtest blockexplorer", async () => {
    await showBitcoinTransaction("txId", networks.regtest);
    expect(openURLSpy).toHaveBeenCalledWith("https://localhost:3000/tx/txId");
  });
});
