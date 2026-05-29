// @ts-nocheck
import { account1 } from "../../../tests/unit/data/accountData";
import { getDescriptorSecretKey } from "./getDescriptorSecretKey";

describe("getDescriptorSecretKey", () => {
  it("creates new random descriptor secret", () => {
    expect(() => getDescriptorSecretKey("bitcoin")).not.toThrow();
  });
  it("loads wallet with seed", () => {
    expect(() => getDescriptorSecretKey("bitcoin", account1.mnemonic)).not.toThrow();
  });
});
