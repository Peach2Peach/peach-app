// @ts-nocheck
import { account1 } from "../../../tests/unit/data/accountData";
import { getDescriptorSecretKey } from "./getDescriptorSecretKey";

describe("getDescriptorSecretKey", () => {
  it("throws rather than generating a seed when no seedphrase is passed", () => {
    expect(() => getDescriptorSecretKey("bitcoin")).toThrow(
      "MISSING_SEEDPHRASE",
    );
    expect(() => getDescriptorSecretKey("bitcoin", "")).toThrow(
      "MISSING_SEEDPHRASE",
    );
  });
  it("loads wallet with seed", () => {
    expect(() => getDescriptorSecretKey("bitcoin", account1.mnemonic)).not.toThrow();
  });
});
