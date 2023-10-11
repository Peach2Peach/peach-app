import { View } from 'react-native'
import { Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useNavigation, useRoute } from '../../hooks'
import { useConfigStore } from '../../store/configStore'
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
    <View style={tw`items-center justify-between h-full px-6 pb-7`}>
      <View style={tw`items-center justify-center flex-shrink w-full h-full gap-4`}>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('grouphug.announcement.title')}</Text>
        <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('grouphug.announcement.text')}</Text>
      </View>
      <View style={tw`items-stretch gap-3`}>
        <Button style={tw`bg-primary-background-light`} textColor={tw`text-primary-main`} onPress={goToSettings}>
          {i18n('grouphug.goToSettings')}
        </Button>
        <Button ghost onPress={close}>
          {i18n('close')}
        </Button>
      </View>
    </View>
  )
}
