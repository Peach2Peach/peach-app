import { NETWORK } from '@env'
import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { Button, Headline, Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import { contractIdToHex } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { thousands } from '../../utils/string'
import { ConfirmCancelTradeProps } from '../ConfirmCancelTrade'

/**
 * @description Overlay the seller sees when the buyer accepted cancelation
 */
export const CancelTradeRequestConfirmed = ({ contract }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })
  const showEscrow = () => contract.releaseTxId
    ? showTransaction(contract.releaseTxId, NETWORK)
    : showAddress(contract.escrow, NETWORK)

  return <View style={tw`flex items-center`}>
    <Headline style={tw`text-center text-white-1 font-baloo text-xl leading-8`}>
      {i18n('contract.cancel.seller.confirmed.title')}
    </Headline>
    <Text style={tw`text-center text-white-1 mt-8`}>
      {i18n(
        'contract.cancel.seller.confirmed.text.1',
        contractIdToHex(contract.id),
        i18n('currency.format.sats', thousands(contract.amount))
      )}
    </Text>
    <Text style={tw`text-center text-white-1 mt-2`}>
      {i18n('contract.cancel.seller.confirmed.text.2')}
    </Text>
    <View>
      <Button
        style={tw`mt-8`}
        title={i18n('showEscrow')}
        tertiary={true}
        wide={false}
        onPress={showEscrow}
      />
      <Button
        style={tw`mt-2`}
        title={i18n('close')}
        secondary={true}
        wide={false}
        onPress={closeOverlay}
      />
    </View>
  </View>
}