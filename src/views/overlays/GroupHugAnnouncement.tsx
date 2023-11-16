import { Overlay } from '../../components/Overlay'
import { Button } from '../../components/buttons/Button'
import { useNavigation, useRoute } from '../../hooks'
import { useConfigStore } from '../../store/configStore/configStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const GroupHugAnnouncement = () => {
  const { offerId } = useRoute<'groupHugAnnouncement'>().params
  const navigation = useNavigation()
  const setHasSeenGroupHugAnnouncement = useConfigStore((state) => state.setHasSeenGroupHugAnnouncement)

  const goToSettings = () => {
    setHasSeenGroupHugAnnouncement(true)
    navigation.reset({
      index: 1,
      routes: [{ name: 'settings' }, { name: 'transactionBatching' }],
    })
  }
  const close = () => {
    setHasSeenGroupHugAnnouncement(true)
    navigation.replace('offerPublished', { offerId, isSellOffer: false, shouldGoBack: true })
  }

  return (
    <Overlay
      title={i18n('grouphug.announcement.title')}
      text={i18n('grouphug.announcement.text')}
      buttons={
        <>
          <Button style={tw`bg-primary-background-light`} textColor={tw`text-primary-main`} onPress={goToSettings}>
            {i18n('grouphug.goToSettings')}
          </Button>
          <Button onPress={close} ghost>
            {i18n('close')}
          </Button>
        </>
      }
    />
  )
}
