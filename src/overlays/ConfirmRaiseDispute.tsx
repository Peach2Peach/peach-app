import React, { ReactElement, useContext } from 'react'
import { View, Text } from 'react-native'
import { Headline, PrimaryButton } from '../components'
import { OverlayContext } from '../contexts/overlay'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { Navigation } from '../utils/navigation'
import WhatIsADispute from './WhatIsADispute'

/**
 * @description Overlay the user sees when requesting cancelation
 */

export type ConfirmRaiseDisputeProps = {
  contract: Contract
  navigation: Navigation
}
export const ConfirmRaiseDispute = ({ contract, navigation }: ConfirmRaiseDisputeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ visible: false })

  const ok = async () => {
    closeOverlay()
    navigation.navigate('dispute', { contractId: contract.id })
  }

  const openExplainer = () =>
    updateOverlay({
      content: <WhatIsADispute />,
      visible: true,
    })

  return (
    <View style={tw`flex items-center flex-shrink bg-peach-1 rounded-xl p-5`}>
      <Headline style={tw`text-center text-white-1 font-baloo text-lg leading-8`}>
        {i18n('dispute.openDispute')}
      </Headline>
      <Text style={tw`text-center text-white-1 mt-5`}>{i18n('dispute.doYouWantToOpenDispute')}</Text>
      <View>
        <PrimaryButton style={tw`mt-8`} onPress={closeOverlay} narrow>
          {i18n('contract.cancel.confirm.back')}
        </PrimaryButton>
        <PrimaryButton style={tw`mt-2`} onPress={ok} narrow>
          {i18n('dispute.openDispute')}
        </PrimaryButton>
        <PrimaryButton onPress={openExplainer} style={tw`mt-2`} narrow>
          {i18n('whatIsThis')}
        </PrimaryButton>
      </View>
    </View>
  )
}
