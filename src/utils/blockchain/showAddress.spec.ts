import { Linking } from "react-native";
import { liquidAddresses } from "../../../tests/unit/data/liquidNetworkData";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { showAddress } from "./showAddress";

describe("showAddress", () => {
  const openURLSpy = jest.spyOn(Linking, "openURL");

  it("links to bitcoin blockexplorer", async () => {
    await showAddress(sellOffer.returnAddress);
    expect(openURLSpy).toHaveBeenCalledWith(
      `https://localhost:3000/address/${sellOffer.returnAddress}`,
    );
  });
  it("links to liquid blockexplorer", async () => {
    await showAddress(liquidAddresses.regtest[0]);
    expect(openURLSpy).toHaveBeenCalledWith(
      `https://localhost:3001/address/${liquidAddresses.regtest[0]}`,
    );
  });
});
