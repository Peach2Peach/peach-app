import { NETWORK } from '@env'
import React, { ReactElement, useContext, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { Headline, PrimaryButton, Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import { contractIdToHex, getSellOfferFromContract, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getOfferExpiry } from '../../utils/offer'
import { thousands } from '../../utils/string'
import { useStartRefundOverlay } from '../useStartRefundOverlay'

/**
 * @description Overlay the seller sees when the buyer accepted cancelation
 */
export type ConfirmCancelTradeProps = {
  contract: Contract
}

export const BuyerCanceledTrade = ({ contract }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const startRefund = useStartRefundOverlay()
  const sellOffer = useMemo(() => getSellOfferFromContract(contract), [contract])
  const expiry = useMemo(() => getOfferExpiry(sellOffer), [sellOffer])

  const closeOverlay = () => updateOverlay({ visible: false })
  const showEscrow = () =>
    contract.releaseTxId ? showTransaction(contract.releaseTxId, NETWORK) : showAddress(contract.escrow, NETWORK)
  const refund = () => startRefund(sellOffer)

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
        {i18n('contract.cancel.buyer.confirmed.title')}
      </Headline>
      <Text style={tw`mt-8 text-center text-white-1`}>
        {i18n(
          'contract.cancel.buyer.confirmed.text.1',
          contractIdToHex(contract.id),
          i18n('currency.format.sats', thousands(contract.amount)),
        )}
      </Text>
      <Text style={tw`mt-2 text-center text-white-1`}>
        {i18n(`contract.cancel.buyer.confirmed.text.${contract.releaseTxId ? 'refunded' : 'backOnline'}`)}
      </Text>
      <View>
        {expiry.isExpired
          && (contract.releaseTxId ? (
            <PrimaryButton style={tw`mt-8`} onPress={showEscrow} narrow>
              {i18n('showEscrow')}
            </PrimaryButton>
          ) : (
            <PrimaryButton style={tw`mt-8`} onPress={refund} narrow>
              {i18n('escrow.refund')}
            </PrimaryButton>
          ))}
        <PrimaryButton style={tw`mt-2`} onPress={closeOverlay} narrow>
          {i18n('close')}
        </PrimaryButton>
      </View>
    </View>
  )
}
