import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import { Button, Headline, Text } from '../../components'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import { checkAndRefund } from '../../utils/bitcoin'
import { saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { getOffer, saveOffer } from '../../utils/offer'
import { cancelContract, patchOffer } from '../../utils/peachAPI'
import { ConfirmCancelTradeProps } from '../ConfirmCancelTrade'

/**
 * @description Overlay the seller sees when requesting cancelation
 */
// eslint-disable-next-line max-lines-per-function
export const ConfirmCancelTradeSeller = ({ contract, navigation }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [loading, setLoading] = useState(false)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  const ok = async () => {
    setLoading(true)
    const [result, err] = await cancelContract({
      contractId: contract.id,
      // satsPerByte: 1 // TODO fetch fee rate from preferences, note prio suggestions,
    })

    if (result?.psbt) {
      const offer = getOffer(contract.id.split('-')[0]) as SellOffer
      const { tx, txId, err: checkAndRefundError } = await checkAndRefund(result.psbt, offer)
      if (tx && txId) {
        const [patchOfferResult, patchOfferError] = await patchOffer({ offerId: offer.id!, tx })
        if (patchOfferResult) {
          closeOverlay()
          navigation.replace('yourTrades', {})
          saveOffer({
            ...offer,
            tx,
            txId,
          })
          saveContract({
            ...contract,
            cancelConfirmationDismissed: false,
          })
        } else if (patchOfferError) {
          error('Error', patchOfferError)
          updateMessage({
            msg: i18n(patchOfferError?.error || 'error.general'),
            level: 'ERROR',
          })
        }
      } else if (checkAndRefundError) {
        error('Error', checkAndRefundError)
        updateMessage({
          msg: i18n(checkAndRefundError || 'error.general'),
          level: 'ERROR',
        })
      }

    } else if (err) {
      error('Error', err)
      updateMessage({
        msg: i18n(err?.error || 'error.general'),
        level: 'ERROR',
      })
    }
    setLoading(false)
  }

  return <View style={tw`flex items-center`}>
    <Headline style={tw`text-center text-white-1 font-baloo text-xl leading-8`}>
      {i18n('contract.cancel.seller.title')}
    </Headline>
    <Text style={tw`text-center text-white-1 mt-8`}>
      {i18n('contract.cancel.seller.text.1')}
    </Text>
    <Text style={tw`text-center text-white-1 mt-2`}>
      {i18n('contract.cancel.seller.text.2')}
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