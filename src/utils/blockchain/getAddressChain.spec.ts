import { liquidAddresses } from "../../../tests/unit/data/liquidNetworkData";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { getAddressChain } from "./getAddressChain";

describe("getAddressChain", () => {
  it("should return correct chain for address", () => {
    expect(getAddressChain(sellOffer.returnAddress)).toBe("bitcoin");
    expect(getAddressChain(liquidAddresses.regtest[0])).toBe("liquid");
  });
});
