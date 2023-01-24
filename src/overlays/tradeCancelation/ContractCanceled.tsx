import React, { ReactElement, useContext, useEffect } from 'react'
import { View } from 'react-native'
import { Headline, Icon } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { ConfirmCancelTradeProps } from './BuyerCanceledTrade'

/**
 * @description Overlay the buyer sees after succesful cancelation
 */
export const ContractCanceled = ({ contract: { id: contractId } }: ConfirmCancelTradeProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const closeOverlay = () => updateOverlay({ visible: false })

  useEffect(() => {
    setTimeout(() => {
      closeOverlay()
      navigation.navigate('contract', { contractId })
    }, 3000)
  }, [])

  return (
    <View style={tw`flex items-center`}>
      <Headline style={tw`text-3xl text-center text-white-1 font-baloo leading-3xl`}>
        {i18n('yourTrades.tradeCanceled.subtitle')}
      </Headline>
      <View style={tw`flex items-center justify-center w-16 h-16 rounded-full bg-green`}>
        <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color} />
      </View>
    </View>
  )
}
