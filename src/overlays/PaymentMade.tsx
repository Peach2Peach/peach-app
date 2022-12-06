import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'

import tw from '../styles/tailwind'

import { Button, Headline, Icon, Text } from '../components'
import i18n from '../utils/i18n'

import { OverlayContext } from '../contexts/overlay'
import { Navigation } from '../utils/navigation'
import { getOfferIdfromContract } from '../utils/contract'

type Props = {
  contract: Contract
  date: number
  navigation: Navigation
}

export default ({ contract, date, navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    updateOverlay({ visible: false })
  }

  const goToContract = () => {
    navigation.navigate({
      name: 'contract',
      merge: false,
      params: {
        contract: {
          ...contract,
          paymentMade: new Date(date),
        },
        contractId: contract.id,
      },
    })
    closeOverlay()
  }

  return (
    <View style={tw`px-6`}>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('paymentMade.title')}</Headline>
      <View style={tw`flex items-center mt-3`}>
        <View style={tw`flex items-center justify-center w-16 h-16 bg-green rounded-full`}>
          <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color} />
        </View>
      </View>
      <Text style={tw`text-center text-white-1 mt-5`}>
        {i18n('paymentMade.description.1', getOfferIdfromContract(contract))}
        {'\n\n'}
        {i18n('paymentMade.description.2')}
      </Text>
      <View style={tw`flex justify-center items-center mt-5`}>
        <Button title={i18n('goToContract')} secondary={true} wide={false} onPress={goToContract} />
        <Button title={i18n('later')} style={tw`mt-2`} tertiary={true} wide={false} onPress={closeOverlay} />
      </View>
    </View>
  )
}
