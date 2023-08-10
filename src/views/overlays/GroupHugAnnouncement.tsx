import { View } from 'react-native'
import { PrimaryButton, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useGroupHugAnnouncementSetup } from './hooks/useGroupHugAnnouncementSetup'

export const GroupHugAnnouncement = () => {
  const { goToSettings, close } = useGroupHugAnnouncementSetup()

  return (
    <View style={tw`items-center justify-between h-full px-6 pb-7`}>
      <View style={tw`justify-center items-center flex-shrink w-full h-full gap-4`}>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('grouphug.announcement.title')}</Text>
        <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('grouphug.announcement.text')}</Text>
      </View>
      <PrimaryButton white wide onPress={goToSettings}>
        {i18n('grouphug.goToSettings')}
      </PrimaryButton>
      <PrimaryButton white border wide onPress={close} style={tw`mt-2`}>
        {i18n('close')}
      </PrimaryButton>
    </View>
  )
}
