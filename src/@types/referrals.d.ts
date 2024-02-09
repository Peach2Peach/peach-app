type RewardType = "customReferralCode" | "noPeachFees" | "sats";
type Reward = {
  id: RewardType;
  requiredPoints: number;
};
