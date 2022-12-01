import { NETWORK } from '@env'
import React, { ReactElement, useContext, useEffect } from 'react'
import { View } from 'react-native'
import { Headline, PrimaryButton, Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import { getOfferIdfromContract, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getOffer } from '../../utils/offer'
import { thousands } from '../../utils/string'
import { ConfirmCancelTradeProps } from '../ConfirmCancelTrade'
import Refund from '../Refund'

/**
 * @description Overlay the seller sees when the buyer accepted cancelation
 */
export const BuyerCanceledTrade = ({ contract, navigation }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })
  const showEscrow = () =>
    contract.releaseTxId ? showTransaction(contract.releaseTxId, NETWORK) : showAddress(contract.escrow, NETWORK)
  const refund = () => {
    const offer = getOffer(contract.id.split('-')[0]) as SellOffer
    updateOverlay({
      content: <Refund {...{ offer, navigate: closeOverlay, navigation }} />,
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
      {contract.releaseTxId ? (
        <Text style={tw`text-center text-white-1 mt-2`}>{i18n('contract.cancel.buyer.confirmed.text.2')}</Text>
      ) : null}
      <View>
        {contract.releaseTxId ? (
          <PrimaryButton style={tw`mt-8`} onPress={showEscrow}>
            {i18n('showEscrow')}
          </PrimaryButton>
        ) : (
          <PrimaryButton style={tw`mt-8`} onPress={refund}>
            {i18n('escrow.refund')}
          </PrimaryButton>
        )}
        <PrimaryButton style={tw`mt-2`} onPress={closeOverlay}>
          {i18n('close')}
        </PrimaryButton>
      </View>
    </View>
  )
}
