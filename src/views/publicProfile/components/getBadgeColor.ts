import tw from '../../../styles/tailwind'

export const getBadgeColor = (isUnlocked = false, isDispute = false) => {
  if (!isDispute) {
    return isUnlocked ? tw`bg-primary-main` : tw`bg-primary-mild-1`
  }
  return isUnlocked ? tw`bg-error-mild` : tw`bg-error-light`
}
