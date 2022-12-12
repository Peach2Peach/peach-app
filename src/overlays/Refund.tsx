import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../styles/tailwind'

import { Headline, PrimaryButton, Text } from '../components'
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
import { offerIdToHex, saveOffer } from '../utils/offer'
import { thousands } from '../utils/string'
import { useNavigation } from '../hooks'

const textStyle = tw`text-white-1 text-center leading-5`

type WrongFundingAmountMessageProps = {
  sellOffer: SellOffer
  fundingStatus: FundingStatus['status']
}

const WrongFundingAmountMessage = ({ sellOffer, fundingStatus }: WrongFundingAmountMessageProps): ReactElement => (
  <View style={tw`flex justify-center items-center`}>
    <Text style={textStyle}>{i18n(`refund.${fundingStatus}.description`)}</Text>
    <Text style={[textStyle, tw`mt-2`]}>
      {i18n(`refund.${fundingStatus}.youSent`)}: {thousands(sellOffer.funding.amounts.reduce(sum, 0))}
    </Text>
    <Text style={[textStyle, tw`mt-2`]}>
      {i18n(`refund.${fundingStatus}.correctAmount`)}: {thousands(sellOffer.amount)}
    </Text>
    <Text style={[textStyle, tw`mt-2`]}>{i18n(`refund.${fundingStatus}.refund`)}</Text>
  </View>
)

type ReturnAddressMismatchMessageProps = {
  sellOffer: SellOffer
  refundPSBT: Psbt
}

const ReturnAddressMismatchMessage = ({ sellOffer, refundPSBT }: ReturnAddressMismatchMessageProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const goToContact = () => {
    navigation.navigate('report', {
      reason: 'bug',
      topic: i18n('RETURN_ADDRESS_MISMATCH.text'),
      shareDeviceID: true,
      message: [
        `${i18n('trade')} ${offerIdToHex(sellOffer.id!)}`,
        i18n('refund.RETURN_ADDRESS_MISMATCH.doesNotMatch'),
        i18n('refund.RETURN_ADDRESS_MISMATCH.expected', sellOffer.returnAddress || 'null'),
        i18n('refund.RETURN_ADDRESS_MISMATCH.actual', refundPSBT?.txOutputs[0]?.address || 'null'),
      ].join('\n\n'),
    })
    updateOverlay({ visible: false })
  }
  return (
    <View>
      <Text style={textStyle}>
        {i18n('refund.RETURN_ADDRESS_MISMATCH.doesNotMatch')}
        {'\n\n'}
        {i18n('refund.RETURN_ADDRESS_MISMATCH.expected', sellOffer.returnAddress || 'null')}
        {'\n\n'}
        {i18n('refund.RETURN_ADDRESS_MISMATCH.actual', refundPSBT?.txOutputs[0]?.address || 'null')}
        {'\n\n'}
        {i18n('refund.RETURN_ADDRESS_MISMATCH.pleaseCheck')}
      </Text>
      <PrimaryButton style={tw`self-center mt-2`} onPress={goToContact} narrow>
        {i18n('refund.RETURN_ADDRESS_MISMATCH.contactSupport')}
      </PrimaryButton>
    </View>
  )
}

type Props = {
  sellOffer: SellOffer
  navigate: () => void
}

export default ({ sellOffer, navigate }: Props): ReactElement => {
  const navigation = useNavigation()
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const [transactionId, setTransactionId] = useState<string>(sellOffer.txId || '')
  const [refundPSBT, setRefundPSBT] = useState<Psbt>()
  const [returnAddressMismatch, setReturnAddressMismatch] = useState(false)
  const fundingStatus = sellOffer.funding.status === 'WRONG_FUNDING_AMOUNT' ? 'WRONG_FUNDING_AMOUNT' : 'CANCELED'

  const closeOverlay = () => {
    navigate()
    updateOverlay({ visible: false })
  }

  useEffect(
    cancelOfferEffect({
      offer: sellOffer,
      onSuccess: (response) => {
        ;(async () => {
          if (!sellOffer.id) return
          info('Get refunding info', response)
          const { psbt, tx, txId, err } = await checkAndRefund(response.psbt, sellOffer)

          setRefundPSBT(psbt)
          if (tx && txId) {
            saveOffer({
              ...sellOffer,
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
              msgKey: err || 'GENERAL_ERROR',
              level: 'ERROR',
              action: () => navigation.navigate('contact'),
              actionLabel: i18n('contactUs'),
              actionIcon: 'mail',
            })
          }
        })()
      },
      onError: (err) => {
        updateMessage({
          msgKey: err.error || 'GENERAL_ERROR',
          level: 'ERROR',
          action: () => navigation.navigate('contact'),
          actionLabel: i18n('contactUs'),
          actionIcon: 'mail',
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
          !!refundPSBT && <ReturnAddressMismatchMessage {...{ sellOffer, refundPSBT }} />
        ) : fundingStatus === 'WRONG_FUNDING_AMOUNT' && sellOffer.funding ? (
          <WrongFundingAmountMessage {...{ sellOffer, fundingStatus }} />
        ) : (
          <View style={tw`flex justify-center items-center`}>
            <Text style={textStyle}>{i18n(`refund.${fundingStatus}.description`)}</Text>
            <Text style={textStyle}>{i18n(`refund.${fundingStatus}.refund`)}</Text>
          </View>
        )}
        <PrimaryButton style={tw`mt-5`} onPress={closeOverlay} narrow>
          {i18n('close')}
        </PrimaryButton>
        <PrimaryButton
          style={tw`mt-2`}
          disabled={!transactionId}
          onPress={() => showTransaction(transactionId, NETWORK)}
          narrow
        >
          {i18n('showTransaction')}
        </PrimaryButton>
      </View>
    </View>
  )
}
