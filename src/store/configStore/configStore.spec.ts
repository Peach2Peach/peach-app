import { getPeachPGPPublicKey, useConfigStore } from "./configStore";

// The test env runs on regtest, which has no bundled key, so stand one in.
jest.mock("../../utils/pgp/peachPGPPublicKey", () => ({
  bundledPeachPGPPublicKey: "bundledPeachKey",
}));

describe("configStore", () => {
  beforeEach(() => {
    useConfigStore.getState().reset();
  });
  it("dispute disclaimer seen state is false by default", () => {
    expect(useConfigStore.getState().seenDisputeDisclaimer).toBeFalsy();
  });
  it("should set dispute disclaimer seen state", () => {
    useConfigStore.getState().setSeenDisputeDisclaimer(true);
    expect(useConfigStore.getState().seenDisputeDisclaimer).toBeTruthy();
  });
  it("should set minimum trading amount", () => {
    const minTradingAmount = 10;
    useConfigStore.getState().setMinTradingAmount(minTradingAmount);
    expect(useConfigStore.getState().minTradingAmount).toBe(minTradingAmount);
  });
  it("should set maximum trading amount", () => {
    const maxTradingAmount = 100;
    useConfigStore.getState().setMaxTradingAmount(maxTradingAmount);
    expect(useConfigStore.getState().maxTradingAmount).toBe(maxTradingAmount);
  });
});

describe("configStore - peach pgp public key", () => {
  beforeEach(() => {
    useConfigStore.getState().reset();
  });
  it("falls back to the bundled key when none was ever fetched", () => {
    // the state every client is in before its first successful getInfo
    expect(useConfigStore.getState().peachPGPPublicKey).toBe("");
    expect(getPeachPGPPublicKey()).toBe("bundledPeachKey");
  });
  it("prefers the server-provided key so rotation needs no app release", () => {
    useConfigStore.getState().setPeachPGPPublicKey("serverKey");
    expect(getPeachPGPPublicKey()).toBe("serverKey");
  });
  it("does not let an empty key overwrite a stored one", () => {
    useConfigStore.getState().setPeachPGPPublicKey("serverKey");
    useConfigStore.getState().setPeachPGPPublicKey("");
    expect(getPeachPGPPublicKey()).toBe("serverKey");
  });
});
