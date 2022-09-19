import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../styles/tailwind'

import LanguageContext from '../contexts/language'
import { Button, Headline, Text } from '../components'
import i18n from '../utils/i18n'
import { MessageContext } from '../contexts/message'
import cancelOfferEffect from '../effects/cancelOfferEffect'

import { error, info } from '../utils/log'
import { saveOffer } from '../utils/offer'
import { thousands } from '../utils/string'
import { OverlayContext } from '../contexts/overlay'
import { checkAndRefund, showTransaction } from '../utils/bitcoin'
import { NETWORK } from '@env'
import { sum } from '../utils/math'

type Props = {
  offer: SellOffer,
  navigate: () => void,
}

// eslint-disable-next-line max-lines-per-function
export default ({ offer, navigate }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const [transactionId, setTransactionId] = useState<string>(offer.txId || '')
  const fundingStatus = offer.funding.status === 'WRONG_FUNDING_AMOUNT' ? 'WRONG_FUNDING_AMOUNT' : 'CANCELED'

  const closeOverlay = () => {
    navigate()
    updateOverlay({ content: null, showCloseButton: true })
  }

  useEffect(cancelOfferEffect({
    offer,
    onSuccess: response => {
      (async () => {
        if (!offer.id) return
        info('Get refunding info', response)
        const { tx, txId, err } = await checkAndRefund(response.psbt, offer)

        if (tx && txId) {
          saveOffer({
            ...offer,
            tx,
            txId,
            refunded: true
          })
          setTransactionId(() => txId)
        } else if (err) {
          error('Error', err)
          updateMessage({
            msgKey: err || 'error.general',
            level: 'ERROR',
          })
        }
      })()
    },
    onError: err => {
      updateMessage({
        msgKey: err.error || 'error.general',
        level: 'ERROR',
      })
    },
  }), [])

  return <View style={tw`px-6`}>
    <Headline style={tw`text-3xl leading-3xl text-white-1`}>
      {i18n(`refund.${fundingStatus}.title`)}
    </Headline>
    <View style={tw`flex justify-center items-center`}>
      {fundingStatus === 'WRONG_FUNDING_AMOUNT' && offer.funding
        ? <View style={tw`flex justify-center items-center`}>
          <Text style={tw`text-white-1 text-center leading-5`}>
            {i18n(`refund.${fundingStatus}.description`)}
          </Text>
          <Text style={tw`text-white-1 text-center mt-2 leading-5 `}>
            {i18n(`refund.${fundingStatus}.youSent`)}: {thousands(offer.funding.amounts.reduce(sum, 0))}
          </Text>
          <Text style={tw`text-white-1 text-center mt-2 leading-5`}>
            {i18n(`refund.${fundingStatus}.correctAmount`)}: {thousands(offer.amount)}
          </Text>
          <Text style={tw`text-white-1 text-center mt-2 leading-5`}>
            {i18n(`refund.${fundingStatus}.refund`)}
          </Text>
        </View>
        : <View style={tw`flex justify-center items-center`}>
          <Text style={tw`text-white-1 text-center leading-5`}>
            {i18n(`refund.${fundingStatus}.description`)}
          </Text>
          <Text style={tw`text-white-1 text-center leading-5`}>
            {i18n(`refund.${fundingStatus}.refund`)}
          </Text>
        </View>
      }
      <Button
        style={tw`mt-5`}
        title={i18n('close')}
        secondary={true}
        wide={false}
        onPress={closeOverlay}
      />
      <Button
        style={tw`mt-2`}
        tertiary={true}
        wide={false}
        disabled={!transactionId}
        onPress={() => showTransaction(transactionId, NETWORK)}
        title={i18n('showTransaction')}
      />
    </View>
  </View>
}