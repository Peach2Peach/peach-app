import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, Text, Title } from '../../components'
import i18n from '../../utils/i18n'
import { MessageContext } from '../../utils/message'
import * as bitcoin from 'bitcoinjs-lib'
import cancelOfferEffect from '../../effects/cancelOfferEffect'
import getTransactionEffect from '../../effects/getTxEffect'

import { error, info } from '../../utils/log'
import { getEscrowWallet, getFinalScript, getNetwork } from '../../utils/wallet'
import { reverseBuffer } from '../../utils/crypto'
import { postTx } from '../../utils/peachAPI'
import { saveOffer } from '../../utils/offer'
import { thousands } from '../../utils/string'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp, useIsFocused } from '@react-navigation/native'


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'refund'>

type Props = {
  route: RouteProp<{ params: {
    offer: SellOffer,
  } }>,
  navigation: ProfileScreenNavigationProp,
}

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)
  const isFocused = useIsFocused()

  const [psbt, setPSBT] = useState<bitcoin.Psbt>()
  const [inputIndex, setInputIndex] = useState(0)
  const [amount, setAmount] = useState(0)
  const [fees, setFees] = useState(0)
  const [offer, setOffer] = useState(route.params?.offer)
  const [returnAddress, setReturnAddress] = useState(route.params?.offer.returnAddress)
  const [txId, setTxId] = useState<string>(route.params?.offer.txId || '')
  const [transaction, setTransaction] = useState<Transaction>()
  const [valid, setValid] = useState(false)
  const fundingStatus = offer.funding?.status === 'WRONG_FUNDING_AMOUNT' ? 'WRONG_FUNDING_AMOUNT' : 'CANCELED'

  useEffect(() => {
    if (!isFocused) return

    setOffer(() => route.params?.offer)
  }, [isFocused])

  useEffect(isFocused ? cancelOfferEffect({
    offer,
    onSuccess: result => {
      info('Get refunding info', result)
      setPSBT(() => bitcoin.Psbt.fromBase64(result.psbt, { network: getNetwork() }))
      setAmount(() => result.amount)
      setFees(() => result.fees)
      setInputIndex(() => result.inputIndex)
      setReturnAddress(() => result.returnAddress)
    },
    onError: (err) => {
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    },
  }) : () => {}, [isFocused, offer.id])

  useEffect(isFocused && txId ? getTransactionEffect({
    txId,
    onSuccess: result => {
      info('Get transaction', result)
      setTransaction(() => result)
    },
    onError: (err) => {
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    },
  }) : () => {}, [isFocused, txId])

  useEffect(() => {
    if (!amount || !fees || !psbt || !offer || !offer.funding) return
    const errorMsg = []

    // Don't trust the response, verify
    if (offer.funding.txId !== reverseBuffer(psbt.txInputs[inputIndex].hash).toString('hex')) {
      errorMsg.push(i18n('error.invalidInput'))
    }
    if (offer.funding.amount !== amount + fees) {
      errorMsg.push(i18n('error.invalidAmount'))
    }
    if (returnAddress !== offer.returnAddress
      || psbt.txOutputs[0].address !== offer.returnAddress) {
      errorMsg.push(i18n('error.returnAddressMismatch'))
    }

    if (errorMsg.length) {
      updateMessage({
        msg: errorMsg.join('\n'),
        level: 'WARN',
      })
    }

    setValid(() => errorMsg.length === 0)
  }, [psbt, inputIndex, amount, fees, returnAddress])

  const refund = async () => {
    if (!offer.id || !psbt) return

    // Sign psbt
    psbt.signInput(inputIndex, getEscrowWallet(offer.id))

    const tx = psbt.finalizeInput(0, getFinalScript)
      .extractTransaction()
      .toHex()

    const [result, err] = await postTx({
      tx
    })
    if (result) {
      info('refundEscrow: ', JSON.stringify(result))
      saveOffer({
        ...offer,
        tx,
        txId: result.txId,
        refunded: true
      })
      setTxId(() => result.txId)
    } else if (err) {
      error('Error', err)
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }

  return <View style={tw`pb-24 h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <View style={tw`h-full pt-6 overflow-visible`}>
        <View style={tw`pb-8`}>
          <Title title={i18n('refund.title')} />
          <View style={tw`flex justify-center items-center`}>
            <Text style={tw`w-full`}>
              {i18n(`refund.description.${fundingStatus}`)}
            </Text>
            <Text style={tw`w-full mt-4`}>
              {i18n('amount')}: {i18n('currency.format.sats', thousands(amount))}
            </Text>
            <Text style={tw`w-full`}>
              {i18n('fees')}: {i18n('currency.format.sats', thousands(fees))}
            </Text>
            <Text style={tw`w-full`}>
              {i18n('returnAddress')}: {returnAddress}
            </Text>
            <Text style={tw`w-full`}>
              {i18n('txId')}: {txId}
            </Text>
            {transaction
              ? <Text style={tw`w-full`}>
                {i18n('txConfirmed')}: {transaction.status.confirmed ? 'yes' : 'no'}
              </Text>
              : null
            }
            <Button
              style={tw`mt-6`}
              disabled={!valid || !!txId || transaction?.status.confirmed}
              wide={false}
              onPress={refund}
              title={i18n(transaction?.status.confirmed
                ? 'refunded'
                : txId
                  ? 'refundPending'
                  : 'refund'
              )}
            />
          </View>
        </View>
      </View>
    </View>
  </View>
}