export const isRewardAvailable = (reward: Reward, balance: number) =>
  reward.requiredPoints <= balance && reward.id !== 'sats'
