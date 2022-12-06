import React, { ReactElement, useContext, useEffect } from 'react'
import { View } from 'react-native'
import { Headline, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import { getOfferIdfromContract, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { ConfirmCancelTradeProps } from '../ConfirmCancelTrade'

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
      <Headline style={tw`text-center text-white-1 font-baloo text-xl leading-8`}>
        {i18n('contract.cancel.seller.rejected.title')}
      </Headline>
      <Text style={tw`text-center text-white-1 mt-8`}>
        {i18n('contract.cancel.seller.rejected.text.1', getOfferIdfromContract(contract))}
      </Text>
      <Text style={tw`text-center text-white-1 mt-2`}>{i18n('contract.cancel.seller.rejected.text.2')}</Text>
      <PrimaryButton style={tw`mt-8`} onPress={closeOverlay} narrow>
        {i18n('close')}
      </PrimaryButton>
    </View>
  )
}
