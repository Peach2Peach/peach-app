import { Linking } from "react-native";
import { showTransaction } from "./showTransaction";

describe("showTransaction", () => {
  const openURLSpy = jest.spyOn(Linking, "openURL").mockResolvedValue(true);

  it("links to mainnet blockexplorer", async () => {
    await showTransaction("txId", "bitcoin");
    expect(openURLSpy).toHaveBeenCalledWith("https://mempool.space/tx/txId");
  });
  it("links to testnet blockexplorer", async () => {
    await showTransaction("txId", "testnet");
    expect(openURLSpy).toHaveBeenCalledWith(
      "https://mempool.space/testnet/tx/txId",
    );
  });
  it("links to regtest blockexplorer", async () => {
    await showTransaction("txId", "regtest");
    expect(openURLSpy).toHaveBeenCalledWith("https://localhost:3000/tx/txId");
  });
});
