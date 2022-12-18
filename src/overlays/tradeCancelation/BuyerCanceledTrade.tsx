import { NETWORK } from '@env'
import React, { ReactElement, useContext, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { Button, Headline, Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import { getOfferIdfromContract, getSellOfferFromContract, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getOfferExpiry } from '../../utils/offer'
import { thousands } from '../../utils/string'
import { ConfirmCancelTradeProps } from '../ConfirmCancelTrade'
import Refund from '../Refund'

/**
 * @description Overlay the seller sees when the buyer accepted cancelation
 */
export const BuyerCanceledTrade = ({ contract, navigation }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const sellOffer = useMemo(() => getSellOfferFromContract(contract), [contract])
  const expiry = useMemo(() => getOfferExpiry(sellOffer), [sellOffer])

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })
  const showEscrow = () =>
    contract.releaseTxId ? showTransaction(contract.releaseTxId, NETWORK) : showAddress(contract.escrow, NETWORK)
  const refund = () => {
    updateOverlay({
      content: <Refund {...{ sellOffer, navigation }} />,
      showCloseButton: false,
    })
  }

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
        {i18n('contract.cancel.buyer.confirmed.title')}
      </Headline>
      <Text style={tw`text-center text-white-1 mt-8`}>
        {i18n(
          'contract.cancel.buyer.confirmed.text.1',
          getOfferIdfromContract(contract),
          i18n('currency.format.sats', thousands(contract.amount)),
        )}
      </Text>
      <Text style={tw`text-center text-white-1 mt-2`}>
        {i18n(`contract.cancel.buyer.confirmed.text.${contract.releaseTxId ? 'refunded' : 'backOnline'}`)}
      </Text>
      <View>
        {expiry.isExpired ? (
          contract.releaseTxId ? (
            <Button style={tw`mt-8`} title={i18n('showEscrow')} tertiary={true} wide={false} onPress={showEscrow} />
          ) : (
            <Button style={tw`mt-8`} title={i18n('escrow.refund')} tertiary={true} wide={false} onPress={refund} />
          )
        ) : null}
        <Button style={tw`mt-2`} title={i18n('close')} secondary={true} wide={false} onPress={closeOverlay} />
      </View>
    </View>
  )
}
