export function canUserInstantTrade(
  user: User,
  criteria: InstantTradeCriteria,
) {
  return (
    user.rating >= criteria.minReputation &&
    criteria.badges.every((badge) => user.medals.includes(badge)) &&
    user.trades >= criteria.minTrades
  );
}
