import tw from '../../../styles/tailwind'

export const getBadgeTextColor = (unlockedBadges: string[], badgeName: string, isDispute = false) => {
  if (!isDispute) {
    return unlockedBadges.includes(badgeName) ? tw`text-primary-main` : tw`text-primary-mild-1`
  }
  return unlockedBadges.includes(badgeName) ? tw`text-error-mild` : tw`text-error-light`
}
