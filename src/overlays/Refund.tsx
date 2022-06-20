import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../styles/tailwind'

import LanguageContext from '../contexts/language'
import { Button, Headline, Text } from '../components'
import i18n from '../utils/i18n'
import { MessageContext } from '../contexts/message'
import * as bitcoin from 'bitcoinjs-lib'
import cancelOfferEffect from '../effects/cancelOfferEffect'

import { error, info } from '../utils/log'
import { getEscrowWallet, getFinalScript, getNetwork } from '../utils/wallet'
import { postTx } from '../utils/peachAPI'
import { saveOffer } from '../utils/offer'
import { thousands } from '../utils/string'
import { OverlayContext } from '../contexts/overlay'
import { showTransaction, txIdPartOfPSBT } from '../utils/bitcoin'
import { NETWORK } from '@env'
import { sum } from '../utils/math'

const checkAndRefund = async (
  response: CancelOfferResponse,
  offer: SellOffer
): Promise<{
    tx?: string,
    txId?: string|null,
    err?: string|null,
  }> => {
  if (!offer.id) return { err: 'NOT_FOUND' }
  const { returnAddress, amount, fees } = response
  const psbt = bitcoin.Psbt.fromBase64(response.psbt, { network: getNetwork() })

  if (!amount || !fees || !psbt || !offer || !offer.funding?.txIds) return { err: 'NOT_FOUND' }

  // Don't trust the response, verify
  const txIds = offer.funding.txIds
  if (!txIds.every(txId => txIdPartOfPSBT(txId, psbt))) {
    return { err: 'INVALID_INPUT' }
  }

  // refunds should only have one output and this is the expected returnAddress
  if (psbt.txOutputs.length > 1) return { err: 'INVALID_OUTPUT' }
  if (returnAddress !== offer.returnAddress
    || psbt.txOutputs[0].address !== offer.returnAddress) {
    return { err: 'RETURN_ADDRESS_MISMATCH' }
  }

  // Sign psbt
  psbt.txInputs.forEach((input, i) =>
    psbt
      .signInput(i, getEscrowWallet(offer.id!))
      .finalizeInput(i, getFinalScript)
  )

  const tx = psbt
    .extractTransaction()
    .toHex()

  const [result, err] = await postTx({
    tx
  })
  info('refundEscrow: ', JSON.stringify(result))

  return {
    tx,
    txId: result?.txId,
    err: err?.error,
  }
}

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
        const { tx, txId, err } = await checkAndRefund(response, offer)

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
            msg: i18n(err || 'error.general'),
            level: 'ERROR',
          })
        }
      })()
    },
    onError: err => {
      updateMessage({
        msg: i18n(err.error || 'error.general'),
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