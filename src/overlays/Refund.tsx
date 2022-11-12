import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../styles/tailwind'

import { Button, Headline, Text } from '../components'
import LanguageContext from '../contexts/language'
import { MessageContext } from '../contexts/message'
import cancelOfferEffect from '../effects/cancelOfferEffect'
import i18n from '../utils/i18n'

import { NETWORK } from '@env'
import { Psbt } from 'bitcoinjs-lib'
import { OverlayContext } from '../contexts/overlay'
import { checkAndRefund, showTransaction } from '../utils/bitcoin'
import { error, info } from '../utils/log'
import { sum } from '../utils/math'
import { Navigation } from '../utils/navigation'
import { offerIdToHex, saveOffer } from '../utils/offer'
import { thousands } from '../utils/string'

const textStyle = tw`text-white-1 text-center leading-5`

type WrongFundingAmountMessageProps = {
  offer: SellOffer
  fundingStatus: FundingStatus['status']
}

const WrongFundingAmountMessage = ({ offer, fundingStatus }: WrongFundingAmountMessageProps): ReactElement => (
  <View style={tw`flex justify-center items-center`}>
    <Text style={textStyle}>{i18n(`refund.${fundingStatus}.description`)}</Text>
    <Text style={[textStyle, tw`mt-2`]}>
      {i18n(`refund.${fundingStatus}.youSent`)}: {thousands(offer.funding.amounts.reduce(sum, 0))}
    </Text>
    <Text style={[textStyle, tw`mt-2`]}>
      {i18n(`refund.${fundingStatus}.correctAmount`)}: {thousands(offer.amount)}
    </Text>
    <Text style={[textStyle, tw`mt-2`]}>{i18n(`refund.${fundingStatus}.refund`)}</Text>
  </View>
)

type ReturnAddressMismatchMessageProps = {
  offer: SellOffer
  refundPSBT: Psbt
  navigation: Navigation
}

const ReturnAddressMismatchMessage = ({
  offer,
  refundPSBT,
  navigation,
}: ReturnAddressMismatchMessageProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const goToContact = () => {
    navigation.navigate('report', {
      reason: 'bug',
      topic: i18n('RETURN_ADDRESS_MISMATCH.text'),
      shareDeviceID: true,
      message: [
        `${i18n('trade')} ${offerIdToHex(offer.id!)}`,
        i18n('refund.RETURN_ADDRESS_MISMATCH.doesNotMatch'),
        i18n('refund.RETURN_ADDRESS_MISMATCH.expected', offer.returnAddress || 'null'),
        i18n('refund.RETURN_ADDRESS_MISMATCH.actual', refundPSBT?.txOutputs[0]?.address || 'null'),
      ].join('\n\n'),
    })
    updateOverlay({ content: null, showCloseButton: true })
  }
  return (
    <View>
      <Text style={textStyle}>
        {i18n('refund.RETURN_ADDRESS_MISMATCH.doesNotMatch')}
        {'\n\n'}
        {i18n('refund.RETURN_ADDRESS_MISMATCH.expected', offer.returnAddress || 'null')}
        {'\n\n'}
        {i18n('refund.RETURN_ADDRESS_MISMATCH.actual', refundPSBT?.txOutputs[0]?.address || 'null')}
        {'\n\n'}
        {i18n('refund.RETURN_ADDRESS_MISMATCH.pleaseCheck')}
      </Text>
      <View style={tw`flex justify-center items-center mt-2`}>
        <Button
          title={i18n('refund.RETURN_ADDRESS_MISMATCH.contactSupport')}
          secondary={true}
          wide={false}
          onPress={goToContact}
        />
      </View>
    </View>
  )
}

type Props = {
  offer: SellOffer
  navigate: () => void
  navigation: Navigation
}

export default ({ offer, navigate, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const [transactionId, setTransactionId] = useState<string>(offer.txId || '')
  const [refundPSBT, setRefundPSBT] = useState<Psbt>()
  const [returnAddressMismatch, setReturnAddressMismatch] = useState(false)
  const fundingStatus = offer.funding.status === 'WRONG_FUNDING_AMOUNT' ? 'WRONG_FUNDING_AMOUNT' : 'CANCELED'

  const closeOverlay = () => {
    navigate()
    updateOverlay({ content: null, showCloseButton: true })
  }

  useEffect(
    cancelOfferEffect({
      offer,
      onSuccess: (response) => {
        ;(async () => {
          if (!offer.id) return
          info('Get refunding info', response)
          const { psbt, tx, txId, err } = await checkAndRefund(response.psbt, offer)

          setRefundPSBT(psbt)
          if (tx && txId) {
            saveOffer({
              ...offer,
              tx,
              txId,
              refunded: true,
            })
            setTransactionId(() => txId)
          } else if (err === 'RETURN_ADDRESS_MISMATCH') {
            error('Error', err)
            setReturnAddressMismatch(true)
          } else if (err) {
            error('Error', err)
            updateMessage({
              msgKey: err || 'error.general',
              level: 'ERROR',
            })
          }
        })()
      },
      onError: (err) => {
        updateMessage({
          msgKey: err.error || 'error.general',
          level: 'ERROR',
        })
      },
    }),
    [],
  )

  return (
    <View style={tw`px-6`}>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n(`refund.${fundingStatus}.title`)}</Headline>
      <View style={tw`flex justify-center items-center`}>
        {returnAddressMismatch ? (
          !!refundPSBT && <ReturnAddressMismatchMessage {...{ offer, refundPSBT, navigation }} />
        ) : fundingStatus === 'WRONG_FUNDING_AMOUNT' && offer.funding ? (
          <WrongFundingAmountMessage {...{ offer, fundingStatus }} />
        ) : (
          <View style={tw`flex justify-center items-center`}>
            <Text style={textStyle}>{i18n(`refund.${fundingStatus}.description`)}</Text>
            <Text style={textStyle}>{i18n(`refund.${fundingStatus}.refund`)}</Text>
          </View>
        )}
        <Button style={tw`mt-5`} title={i18n('close')} secondary={true} wide={false} onPress={closeOverlay} />
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
  )
}
