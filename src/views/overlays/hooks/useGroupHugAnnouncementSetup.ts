import { useNavigation } from '../../../hooks'

export const useGroupHugAnnouncementSetup = () => {
  const navigation = useNavigation()
  const goToSettings = () => {
    navigation.replace('transactionBatching')
  }
  const close = () => {
    navigation.goBack()
  }
  return {
    goToSettings,
    close,
  }
}
