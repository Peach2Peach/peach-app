import React, { ReactElement, useContext } from 'react'
import { View, Text } from 'react-native'
import { Headline, PrimaryButton } from '../components'
import { OverlayContext } from '../contexts/overlay'
import { useNavigation } from '../hooks'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import WhatIsADispute from './WhatIsADispute'

/**
 * @description Overlay the user sees when requesting cancelation
 */

export type ConfirmRaiseDisputeProps = {
  contract: Contract
}
export const ConfirmRaiseDispute = ({ contract: { id: contractId } }: ConfirmRaiseDisputeProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ visible: false })

  const ok = async () => {
    closeOverlay()
    navigation.navigate('dispute', { contractId })
  }

  const openExplainer = () =>
    updateOverlay({
      content: <WhatIsADispute />,
      visible: true,
    })

  return (
    <View style={tw`flex items-center flex-shrink p-5 bg-peach-1 rounded-xl`}>
      <Headline style={tw`text-lg leading-8 text-center text-white-1 font-baloo`}>
        {i18n('dispute.openDispute')}
      </Headline>
      <Text style={tw`mt-5 text-center text-white-1`}>{i18n('dispute.doYouWantToOpenDispute')}</Text>
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
