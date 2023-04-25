import tw from '../../../styles/tailwind'

export const getBadgeTextColor = (isUnlocked = false, isDispute = false) => {
  if (!isDispute) {
    return isUnlocked ? tw`text-primary-main` : tw`text-primary-mild-1`
  }
  return isUnlocked ? tw`text-error-mild` : tw`text-error-light`
}
