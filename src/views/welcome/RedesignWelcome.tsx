import React, { ReactElement, useMemo } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { PrimaryButton, Text } from '../../components'
import { useHeaderSetup, useNavigation } from '../../hooks'
import i18n from '../../utils/i18n'
import { useConfigStore } from '../../store/configStore'
import shallow from 'zustand/shallow'

export default (): ReactElement => {
  const [setSeenRedesignWelcome] = useConfigStore((state) => [state.setSeenRedesignWelcome], shallow)
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
    <View testID="redesignWelcome" style={tw`flex-1 p-8`}>
      <View style={tw`items-center justify-center flex-grow`}>
        <Text style={tw`mb-8 h4 text-primary-background-light`}>{i18n('welcome.redesign.title')}</Text>
        <Text style={tw`mb-4 text-center body-l text-primary-background-light`}>{i18n('welcome.redesign.text')}</Text>
        <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('welcome.redesign.surprise')}</Text>
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
