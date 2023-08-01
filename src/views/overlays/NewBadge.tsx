import { View } from 'react-native'
import { Icon, PrimaryButton, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useNewBadgeSetup } from './hooks/useNewBadgeSetup'

export const NewBadge = () => {
  const { badge, icon, goToProfile, close } = useNewBadgeSetup()

  return (
    <View style={tw`items-center justify-between h-full px-6 pb-7`}>
      <View style={tw`justify-center flex-shrink w-full h-full`}>
        <View style={tw`flex-row items-center justify-center gap-3`}>
          <Icon id={icon} style={tw`w-12 h-12`} color={tw`text-primary-background-light`.color} />
          <Text style={tw`leading-relaxed text-center h4 text-primary-background-light`}>
            {i18n('notification.user.badge.unlocked.title')}
          </Text>
        </View>
        <Text style={tw`mt-8 text-center body-l text-primary-background-light`}>
          {i18n('notification.user.badge.unlocked.text', i18n(`peachBadges.${badge}`))}
        </Text>
      </View>
      <PrimaryButton white narrow onPress={goToProfile}>
        {i18n('goToProfile')}
      </PrimaryButton>
      <PrimaryButton white narrow border onPress={close} style={tw`mt-2`}>
        {i18n('close')}
      </PrimaryButton>
    </View>
  )
}
