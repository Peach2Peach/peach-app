import { IconType } from '../../../assets/icons'
import { badgeIconMap } from '../../../constants'
import { useNavigation, useRoute } from '../../../hooks'

export const useNewBadgeSetup = () => {
  const navigation = useNavigation()
  const badges = useRoute<'newBadge'>().params.badges.split(',') as Medal[]
  const badge = badges[0]
  const icon = (`${badgeIconMap[badge]}CircleInverted`) as IconType
  const remainingBadges = badges.slice(1, badges.length)

  const close = () => {
    if (remainingBadges.length > 0) {
      navigation.setParams({ badges: remainingBadges.join(',') })
    } else {
      navigation.goBack()
    }
  }
  const goToProfile = () => navigation.replace('myProfile')

  return {
    badge,
    icon,
    goToProfile,
    close,
  }
}
