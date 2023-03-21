declare type RewardType = 'customReferralCode' | 'noPeachFees' | 'sats'
declare type Reward = {
  id: RewardType
  requiredPoints: number
}
