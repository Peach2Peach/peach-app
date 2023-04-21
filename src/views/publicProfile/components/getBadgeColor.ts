import tw from '../../../styles/tailwind'

export const getBadgeColor = (unlockedBadges: string[], badgeName: string, isDispute = false) => {
  if (!isDispute) {
    return unlockedBadges.includes(badgeName) ? tw`bg-primary-main` : tw`bg-primary-mild-1`
  }
  return unlockedBadges.includes(badgeName) ? tw`bg-error-mild` : tw`bg-error-light`
}
