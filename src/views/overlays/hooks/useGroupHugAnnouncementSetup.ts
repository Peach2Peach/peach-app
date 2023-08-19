import { useNavigation, useRoute } from '../../../hooks'
import { useConfigStore } from '../../../store/configStore'

export const useGroupHugAnnouncementSetup = () => {
  const { offerId } = useRoute<'groupHugAnnouncement'>().params
  const navigation = useNavigation()
  const setHasSeenGroupHugAnnouncement = useConfigStore((state) => state.setHasSeenGroupHugAnnouncement)

  const goToSettings = () => {
    setHasSeenGroupHugAnnouncement(true)
    navigation.replace('transactionBatching')
  }
  const close = () => {
    setHasSeenGroupHugAnnouncement(true)
    navigation.replace('offerPublished', { offerId, isSellOffer: false })
  }
  return {
    goToSettings,
    close,
  }
}
