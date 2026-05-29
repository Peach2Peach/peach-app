// @ts-nocheck
import { BlockChainNames } from "../../../utils/wallet/bdkShim";
import { checkNodeConnection } from "./checkNodeConnection";

describe("checkNodeConnection", () => {
  it("returns a result", async () => {
    const r = await checkNodeConnection("electrum.node");
    expect(r).toBeDefined();
    expect(typeof BlockChainNames).toBe("object");
  });
});
