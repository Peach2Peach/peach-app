import React, { ReactElement, useContext, useEffect } from 'react'
import { View } from 'react-native'
import { Headline, PrimaryButton, Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import { contractIdToHex, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { ConfirmCancelTradeProps } from './BuyerCanceledTrade'

/**
 * @description Overlay the seller sees when the buyer accepted cancelation
 */
export const CancelTradeRequestRejected = ({ contract }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ visible: false })

  useEffect(() => {
    saveContract({
      ...contract,
      cancelConfirmationDismissed: true,
      cancelConfirmationPending: false,
    })
  }, [])

  return (
    <View style={tw`flex items-center`}>
      <Headline style={tw`text-xl leading-8 text-center text-white-1 font-baloo`}>
        {i18n('contract.cancel.seller.rejected.title')}
      </Headline>
      <Text style={tw`mt-8 text-center text-white-1`}>
        {i18n('contract.cancel.seller.rejected.text.1', contractIdToHex(contract.id))}
      </Text>
      <Text style={tw`mt-2 text-center text-white-1`}>{i18n('contract.cancel.seller.rejected.text.2')}</Text>
      <PrimaryButton style={tw`mt-8`} onPress={closeOverlay} narrow>
        {i18n('close')}
      </PrimaryButton>
    </View>
  )
}
