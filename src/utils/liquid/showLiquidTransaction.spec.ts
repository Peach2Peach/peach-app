import { networks } from "liquidjs-lib";
import { Linking } from "react-native";
import { showLiquidTransaction } from "./showLiquidTransaction";

describe("showLiquidTransaction", () => {
  const openURLSpy = jest.spyOn(Linking, "openURL");

  it("links to mainnet blockexplorer", async () => {
    await showLiquidTransaction("txId", networks.liquid);
    expect(openURLSpy).toHaveBeenCalledWith("https://liquid.network/tx/txId");
  });
  it("links to testnet blockexplorer", async () => {
    await showLiquidTransaction("txId", networks.testnet);
    expect(openURLSpy).toHaveBeenCalledWith(
      "https://liquid.network/testnet/tx/txId",
    );
  });
  it("links to regtest blockexplorer", async () => {
    await showLiquidTransaction("txId", networks.regtest);
    expect(openURLSpy).toHaveBeenCalledWith("https://localhost:3001/tx/txId");
  });
});
