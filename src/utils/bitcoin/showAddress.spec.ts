import { Linking } from "react-native";
import { showAddress } from "./showAddress";

describe("showAddress", () => {
  const openURLSpy = jest.spyOn(Linking, "openURL").mockResolvedValue(true);

  it("links to mainnet blockexplorer", async () => {
    await showAddress("address", "bitcoin");
    expect(openURLSpy).toHaveBeenCalledWith(
      "https://mempool.space/address/address",
    );
  });
  it("links to testnet blockexplorer", async () => {
    await showAddress("address", "testnet");
    expect(openURLSpy).toHaveBeenCalledWith(
      "https://mempool.space/testnet/address/address",
    );
  });
  it("links to regtest blockexplorer", async () => {
    await showAddress("address", "regtest");
    expect(openURLSpy).toHaveBeenCalledWith(
      "https://localhost:3000/address/address",
    );
  });
});
