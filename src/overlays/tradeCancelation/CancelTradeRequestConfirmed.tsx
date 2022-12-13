import { NETWORK } from '@env'
import React, { ReactElement, useContext, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import shallow from 'zustand/shallow'
import { Button, Headline, Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import { useUserDataStore } from '../../store'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import { getOfferIdfromContract } from '../../utils/contract'
import { getSellOfferFromContract } from '../../utils/contract/getSellOfferFromContract'
import i18n from '../../utils/i18n'
import { getOfferExpiry } from '../../utils/offer'
import { thousands } from '../../utils/string'
import { ConfirmCancelTradeProps } from '../ConfirmCancelTrade'

/**
 * @description Overlay the seller sees when the buyer accepted cancelation
 */
export const CancelTradeRequestConfirmed = ({ contract }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const { setContract } = useUserDataStore(
    (state) => ({
      setContract: state.setContract,
    }),
    shallow,
  )

  const sellOffer = useMemo(() => getSellOfferFromContract(contract), [contract])
  const expiry = useMemo(() => getOfferExpiry(sellOffer), [sellOffer])

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })
  const showEscrow = () =>
    contract.releaseTxId ? showTransaction(contract.releaseTxId, NETWORK) : showAddress(contract.escrow, NETWORK)

  useEffect(() => {
    setContract({
      ...contract,
      cancelConfirmationDismissed: true,
      cancelConfirmationPending: false,
    })
  }, [setContract])

  return (
    <View style={tw`flex items-center`}>
      <Headline style={tw`text-center text-white-1 font-baloo text-xl leading-8`}>
        {i18n('contract.cancel.seller.confirmed.title')}
      </Headline>
      <Text style={tw`text-center text-white-1 mt-8`}>
        {i18n(
          'contract.cancel.seller.confirmed.text.1',
          getOfferIdfromContract(contract),
          i18n('currency.format.sats', thousands(contract.amount)),
        )}
      </Text>
      <Text style={tw`text-center text-white-1 mt-2`}>
        {i18n(`contract.cancel.seller.confirmed.text.${expiry.isExpired ? 'refundEscrow' : 'backOnline'}`)}
      </Text>

      <View>
        <Button style={tw`mt-8`} title={i18n('showEscrow')} tertiary={true} wide={false} onPress={showEscrow} />
        <Button style={tw`mt-2`} title={i18n('close')} secondary={true} wide={false} onPress={closeOverlay} />
      </View>
    </View>
  )
}
