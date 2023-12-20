import { useAtom } from 'jotai'
import { overlayAtom } from '../../App'
import { IconType } from '../../assets/icons'
import { Overlay } from '../../components/Overlay'
import { Button } from '../../components/buttons/Button'
import { badgeIconMap } from '../../constants'
import { useNavigation } from '../../hooks/useNavigation'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const NewBadge = ({ badges }: { badges: Medal[] }) => {
  const navigation = useNavigation()
  const [, setOverlayContent] = useAtom(overlayAtom)
  const badge = badges[0]
  const icon = `${badgeIconMap[badge]}CircleInverted` as IconType
  const remainingBadges = badges.slice(1, badges.length)

  const close = () => setOverlayContent(remainingBadges.length > 0 ? <NewBadge badges={remainingBadges} /> : undefined)

  const goToProfile = () => {
    navigation.navigate('myProfile')
    setOverlayContent(undefined)
  }

  return (
    <Overlay
      title={i18n('notification.user.badge.unlocked.title')}
      text={i18n('notification.user.badge.unlocked.text', i18n(`peachBadges.${badge}`))}
      iconId={icon}
      buttons={
        <>
          <Button style={tw`bg-primary-background-light`} textColor={tw`text-primary-main`} onPress={goToProfile}>
            {i18n('goToProfile')}
          </Button>
          <Button onPress={close} ghost>
            {i18n('close')}
          </Button>
        </>
      }
    />
  )
}
