import React, { ReactElement, useContext, useState } from 'react'
import { View, Text } from 'react-native'
import { Button, Headline } from '../components'
import { MessageContext } from '../contexts/message'
import { OverlayContext } from '../contexts/overlay'
import tw from '../styles/tailwind'
import { account } from '../utils/account'
import { checkRefundPSBT, signPSBT } from '../utils/bitcoin'
import { saveContract } from '../utils/contract'
import i18n from '../utils/i18n'
import { error } from '../utils/log'
import { Navigation } from '../utils/navigation'
import { getOffer, saveOffer } from '../utils/offer'
import { cancelContract, patchOffer } from '../utils/peachAPI'
import { ContractCanceled } from './tradeCancelation/ContractCanceled'

/**
 * @description Overlay the user sees when requesting cancelation
 */

export type ConfirmCancelTradeProps = {
  contract: Contract,
  navigation: Navigation
}
// eslint-disable-next-line max-lines-per-function
export const ConfirmCancelTrade = ({ contract, navigation }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [loading, setLoading] = useState(false)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  const confirmCancelSeller = async (result: CancelContractResponse|null) => {
    if (result?.psbt) {
      const offer = getOffer(contract.id.split('-')[0]) as SellOffer // TODO check seller or buyer
      const { isValid, psbt, err: checkRefundPSBTError } = checkRefundPSBT(result.psbt, offer)
      if (isValid && psbt) {
        const signedPSBT = signPSBT(psbt, offer, false)
        const [patchOfferResult, patchOfferError] = await patchOffer({
          offerId: offer.id!,
          refundTx: signedPSBT.toBase64()
        })
        if (patchOfferResult) {
          closeOverlay()
          navigation.navigate('yourTrades', {})
          saveOffer({
            ...offer,
            refundTx: psbt.toBase64(),
          })
          saveContract({
            ...contract,
            cancelConfirmationDismissed: false,
            cancelationRequested: true,
            cancelConfirmationPending: true,
          })
        } else if (patchOfferError) {
          error('Error', patchOfferError)
          updateMessage({
            msg: i18n(patchOfferError?.error || 'error.general'),
            level: 'ERROR',
          })
        }
      } else if (checkRefundPSBTError) {
        error('Error', checkRefundPSBTError)
        updateMessage({
          msg: i18n(checkRefundPSBTError || 'error.general'),
          level: 'ERROR',
        })
      }
    }
  }

  const confirmCancelBuyer = () => {
    saveContract({
      ...contract,
      canceled: true
    })
    updateOverlay({ content: <ContractCanceled contract={contract} navigation={navigation} /> })
  }

  const ok = async () => {
    setLoading(true)
    const [result, err] = await cancelContract({
      contractId: contract.id,
      // satsPerByte: 1 // TODO fetch fee rate from preferences, note prio suggestions,
    })

    if (err) {
      error('Error', err)
      updateMessage({
        msg: i18n(err?.error || 'error.general'),
        level: 'ERROR',
      })
    } else {
      if (contract.seller.id === account.publicKey) await confirmCancelSeller(result)
      if (contract.buyer.id === account.publicKey) confirmCancelBuyer()
    }
    setLoading(false)
  }
  return <View style={tw`flex items-center flex-shrink bg-peach-1 rounded-xl p-5`}>
    <Headline style={tw`text-center text-white-1 font-baloo text-lg leading-8`}>
      {i18n('contract.cancel.title')}
    </Headline>
    <Text style={tw`text-center text-white-1 mt-5`}>
      {i18n('contract.cancel.seller.text')}
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
}