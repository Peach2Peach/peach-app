import React, { ReactElement, useMemo } from 'react'
import { View, Image } from 'react-native'
import tw from '../../styles/tailwind'
import { PrimaryButton, Text } from '../../components'
import { useHeaderSetup, useNavigation } from '../../hooks'
import i18n from '../../utils/i18n'
import { useConfigStore } from '../../store/configStore'
import shallow from 'zustand/shallow'
import bitcoinAnimation from '../../assets/animated/bitcoin.gif'
import { useSettingsStore } from '../../store/settingsStore'

export default (): ReactElement => {
  const [setSeenRedesignWelcome] = useConfigStore((state) => [state.setSeenRedesignWelcome], shallow)
  const [usedReferralCode] = useSettingsStore((state) => [state.usedReferralCode], shallow)
  const { goBack } = useNavigation()
  useHeaderSetup(
    useMemo(
      () => ({
        hideGoBackButton: true,
        theme: 'inverted',
      }),
      [],
    ),
  )
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
