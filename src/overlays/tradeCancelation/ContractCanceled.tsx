import React, { ReactElement, useContext, useEffect } from 'react'
import { View } from 'react-native'
import { Headline, Icon } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { ConfirmCancelTradeProps } from '../ConfirmCancelTrade'

/**
 * @description Overlay the buyer sees after succesful cancelation
 */
export const ContractCanceled = ({ contract, navigation }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  useEffect(() => {
    setTimeout(() => {
      closeOverlay()
      navigation.navigate('contract', { contractId: contract.id })
    }, 3000)
  }, [])

  return (
    <View style={tw`flex items-center`}>
      <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
        {i18n('yourTrades.tradeCanceled.subtitle')}
      </Headline>
      <View style={tw`flex items-center justify-center w-16 h-16 bg-green rounded-full`}>
        <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color} />
      </View>
    </View>
  )
}
