import { useConfigStore } from "./configStore";

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
  it("dispute hasSeenGroupHugAnnouncement seen state is false by default", () => {
    expect(useConfigStore.getState().hasSeenGroupHugAnnouncement).toBeFalsy();
  });
  it("should set dispute hasSeenGroupHugAnnouncement state", () => {
    useConfigStore.getState().setHasSeenGroupHugAnnouncement(true);
    expect(useConfigStore.getState().hasSeenGroupHugAnnouncement).toBeTruthy();
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
