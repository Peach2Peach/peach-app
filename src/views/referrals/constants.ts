export const POINTS_PER_FREE_TRADE = 100;
export const NUMBER_OF_FREE_TRADES = 2;
export const REWARDINFO: Reward[] = [
  { id: "customReferralCode", requiredPoints: 100 },
  {
    id: "noPeachFees",
    requiredPoints: POINTS_PER_FREE_TRADE * NUMBER_OF_FREE_TRADES,
  },
  { id: "sats", requiredPoints: 300 },
];
