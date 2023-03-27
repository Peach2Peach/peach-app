const unavailable = ['noPeachFees', 'sats']

export const isRewardAvailable = (reward: Reward, balance: number) =>
  reward.requiredPoints <= balance && !unavailable.includes(reward.id)
