import { useNavigation } from '../../../hooks'
import { useConfigStore } from '../../../store/configStore'

export const useGroupHugAnnouncementSetup = () => {
  const navigation = useNavigation()
  const setHasSeenGroupHugAnnouncement = useConfigStore((state) => state.setHasSeenGroupHugAnnouncement)

  const goToSettings = () => {
    setHasSeenGroupHugAnnouncement(true)
    navigation.replace('transactionBatching')
  }
  const close = () => {
    setHasSeenGroupHugAnnouncement(true)
    navigation.goBack()
  }
  return {
    goToSettings,
    close,
  }
}
