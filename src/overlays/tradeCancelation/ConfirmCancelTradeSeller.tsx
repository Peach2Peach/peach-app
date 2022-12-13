import React, { ReactElement, useContext, useMemo, useState } from 'react'
import { View } from 'react-native'
import shallow from 'zustand/shallow'
import { Button, Headline, Text } from '../../components'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import { useUserDataStore } from '../../store'
import tw from '../../styles/tailwind'
import { checkRefundPSBT, signPSBT } from '../../utils/bitcoin'
import { getSellOfferFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { getOfferExpiry, saveOffer } from '../../utils/offer'
import { cancelContract, patchOffer } from '../../utils/peachAPI'
import { ConfirmCancelTradeProps } from '../ConfirmCancelTrade'

/**
 * @description Overlay the seller sees when requesting cancelation
 */
export const ConfirmCancelTradeSeller = ({ contract, navigation }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const { setContract } = useUserDataStore(
    (state) => ({
      setContract: state.setContract,
    }),
    shallow,
  )
  const [loading, setLoading] = useState(false)
  const sellOffer = useMemo(() => getSellOfferFromContract(contract), [contract])
  const expiry = useMemo(() => getOfferExpiry(sellOffer), [sellOffer])
  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  const ok = async () => {
    setLoading(true)
    const [result, err] = await cancelContract({
      contractId: contract.id,
      // satsPerByte: 1 // TODO fetch fee rate from preferences, note prio suggestions,
    })

    if (result?.psbt) {
      const { isValid, psbt, err: checkRefundPSBTError } = checkRefundPSBT(result.psbt, sellOffer)
      if (isValid && psbt) {
        const signedPSBT = signPSBT(psbt, sellOffer, false)
        const [patchOfferResult, patchOfferError] = await patchOffer({
          offerId: sellOffer.id!,
          refundTx: signedPSBT.toBase64(),
        })
        if (patchOfferResult) {
          closeOverlay()
          navigation.navigate('yourTrades', {})
          saveOffer({
            ...sellOffer,
            refundTx: psbt.toBase64(),
          })
          setContract({
            ...contract,
            cancelConfirmationDismissed: false,
            cancelationRequested: true,
            cancelConfirmationPending: true,
          })
        } else if (patchOfferError) {
          error('Error', patchOfferError)
          updateMessage({
            msgKey: patchOfferError?.error || 'error.general',
            level: 'ERROR',
          })
        }
      } else if (checkRefundPSBTError) {
        error('Error', checkRefundPSBTError)
        updateMessage({
          msgKey: checkRefundPSBTError || 'error.general',
          level: 'ERROR',
        })
      }
    } else if (err) {
      error('Error', err)
      updateMessage({
        msgKey: err?.error || 'error.general',
        level: 'ERROR',
      })
    }
    setLoading(false)
  }

  return (
    <View style={tw`flex items-center`}>
      <Headline style={tw`text-center text-white-1 font-baloo text-xl leading-8`}>
        {i18n('contract.cancel.title')}
      </Headline>
      <Text style={tw`text-center text-white-1 mt-8`}>
        {i18n('contract.cancel.text')}
        {'\n\n'}
        {i18n('contract.cancel.seller.text.paymentMightBeDone')}
        {'\n\n'}
        {i18n(`contract.cancel.seller.text.${expiry.isExpired ? 'refundEscrow' : 'backOnline'}`)}
      </Text>
      <View>
        <Button
          style={tw`mt-8`}
          title={i18n('contract.cancel.confirm.back')}
          secondary={true}
          wide={false}
          loading={loading}
          onPress={closeOverlay}
        />
        <Button
          style={tw`mt-2`}
          title={i18n('contract.cancel.confirm.ok')}
          tertiary={true}
          wide={false}
          loading={loading}
          onPress={ok}
        />
      </View>
    </View>
  )
}
