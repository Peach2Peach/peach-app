import { isRewardAvailable } from "./isRewardAvailable";

describe("isRewardAvailable", () => {
  it("returns true if reward is available", () => {
    const REQUIRED_POINTS = 100;
    const reward: Reward = {
      id: "customReferralCode",
      requiredPoints: REQUIRED_POINTS,
    };
    expect(isRewardAvailable(reward, REQUIRED_POINTS)).toBe(true);
  });
  it("returns false if reward is not available", () => {
    const REQUIRED_POINTS = 100;
    const reward: Reward = {
      id: "customReferralCode",
      requiredPoints: REQUIRED_POINTS,
    };
    expect(isRewardAvailable(reward, REQUIRED_POINTS - 1)).toBe(false);
  });
  it("returns false if reward sats", () => {
    const REQUIRED_POINTS = 100;
    const reward: Reward = {
      id: "sats",
      requiredPoints: REQUIRED_POINTS,
    };
    expect(isRewardAvailable(reward, REQUIRED_POINTS)).toBe(false);
  });
});
