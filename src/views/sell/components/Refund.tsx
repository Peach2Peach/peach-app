import React, { ReactElement, useContext, useEffect, useState } from 'react'
import * as bitcoin from 'bitcoinjs-lib'
import { View } from 'react-native'
import { Button, Text } from '../../../components'
import LanguageContext from '../../../components/inputs/LanguageSelect'
import cancelOfferEffect from '../../../effects/cancelOfferEffect'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { error, info } from '../../../utils/logUtils'
import { MessageContext } from '../../../utils/messageUtils'
import { thousands } from '../../../utils/string'
import { getEscrowWallet, getFinalScript, getNetwork } from '../../../utils/walletUtils'
import { saveOffer } from '../../../utils/offer'
import { reverseBuffer } from '../../../utils/crypto'
import { postTx } from '../../../utils/peachAPI'
import getTransactionEffect from '../../../effects/getTxEffect'

export type RefundProps = {
  offer: SellOffer,
}

// eslint-disable-next-line max-lines-per-function
export default ({ offer }: RefundProps): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const [psbt, setPSBT] = useState<bitcoin.Psbt>()
  const [inputIndex, setInputIndex] = useState(0)
  const [amount, setAmount] = useState(0)
  const [fees, setFees] = useState(0)
  const [returnAddress, setReturnAddress] = useState(offer.returnAddress)
  const [txId, setTxId] = useState<string>(offer.txId || '')
  const [transaction, setTransaction] = useState<Transaction>()
  const [valid, setValid] = useState(false)

  useEffect(cancelOfferEffect({
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
  }), [offer.id])

  useEffect(txId ? getTransactionEffect({
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
  }) : () => {}, [txId])

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
  return <View style={tw`flex justify-center items-center`}>
    <Text style={tw`w-full`}>
      {i18n('error.WRONG_FUNDING_AMOUNT')}
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
      disabled={!valid && !txId}
      wide={false}
      onPress={refund} // TODO add refunding logic
      title={i18n(!txId
        ? 'refund'
        : transaction?.status.confirmed
          ? 'refundPending'
          : 'refunded'
      )}
    />
  </View>
}