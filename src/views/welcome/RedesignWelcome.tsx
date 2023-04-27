import { ReactElement } from 'react'
import { Image, View } from 'react-native'
import { shallow } from 'zustand/shallow'
import bitcoinAnimation from '../../assets/animated/bitcoin.gif'
import { PrimaryButton, Text } from '../../components'
import { useNavigation } from '../../hooks'
import { useOnboardingHeader } from '../../hooks/headers/useOnboardingHeader'
import { useConfigStore } from '../../store/configStore'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export default (): ReactElement => {
  const [setSeenRedesignWelcome] = useConfigStore((state) => [state.setSeenRedesignWelcome], shallow)
  const [usedReferralCode] = useSettingsStore((state) => [state.usedReferralCode], shallow)
  const { goBack } = useNavigation()

  useOnboardingHeader({
    icons: [],
    hideGoBackButton: true,
  })

  return (
    <View testID="redesignWelcome" style={tw`flex-1`}>
      <View style={tw`items-center justify-center flex-grow`}>
        <View style={tw`flex-row w-full px-4`}>
          <Image source={bitcoinAnimation} style={tw`w-59px h-64px`} resizeMode="contain" />
          <Text style={tw`flex-1 mb-8 ml-4 h4 text-primary-background-light`}>{i18n('welcome.redesign.title')}</Text>
        </View>
        <View style={tw`px-8`}>
          <Text style={tw`mb-4 text-center body-l text-primary-background-light`}>{i18n('welcome.redesign.text')}</Text>
          {usedReferralCode && (
            <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('welcome.redesign.surprise')}</Text>
          )}
        </View>
      </View>
      <View style={[tw`flex items-center w-full pt-4 mb-8`]}>
        <PrimaryButton
          testID="redesignWelcome-close"
          white
          onPress={() => {
            setSeenRedesignWelcome(true)
            goBack()
          }}
          iconId="trendingUp"
        >
          {i18n('lfg')}
        </PrimaryButton>
      </View>
    </View>
  )
}
