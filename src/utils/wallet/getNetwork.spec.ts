import { networks } from "bitcoinjs-lib";
import { getNetwork } from "./getNetwork";

describe("getNetwork", () => {
  it("returns network provided in .env", () => {
    expect(getNetwork()).toStrictEqual(networks.regtest);
  });
});
