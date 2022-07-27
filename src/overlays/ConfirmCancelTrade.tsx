import { NETWORK } from '@env'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'

import { Button, Headline, Text } from '../components'
import Icon from '../components/Icon'
import { MessageContext } from '../contexts/message'
import { OverlayContext } from '../contexts/overlay'
import tw from '../styles/tailwind'
import { account } from '../utils/account'
import { checkAndRefund, showAddress, showTransaction } from '../utils/bitcoin'
import { contractIdToHex, saveContract } from '../utils/contract'
import i18n from '../utils/i18n'
import { error } from '../utils/log'
import { StackNavigation } from '../utils/navigation'
import { getOffer, saveOffer } from '../utils/offer'
import { cancelContract, patchOffer } from '../utils/peachAPI'
import { thousands } from '../utils/string'

type ConfirmCancelTradeProps = {
  contract: Contract,
  navigation: StackNavigation
}

/**
 * @description Overlay the seller sees when the buyer accepted cancelation
 */
export const CancelTradeRequestConfirmed = ({ contract }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })
  const showEscrow = () => contract.releaseTxId
    ? showTransaction(contract.releaseTxId, NETWORK)
    : showAddress(contract.escrow, NETWORK)

  return <View style={tw`flex items-center`}>
    <Headline style={tw`text-center text-white-1 font-baloo text-xl leading-8`}>
      {i18n('contract.cancel.seller.confirmed.title')}
    </Headline>
    <Text style={tw`text-center text-white-1 mt-8`}>
      {i18n(
        'contract.cancel.seller.confirmed.text.1',
        contractIdToHex(contract.id),
        i18n('currency.format.sats', thousands(contract.amount))
      )}
    </Text>
    <Text style={tw`text-center text-white-1 mt-2`}>
      {i18n('contract.cancel.seller.confirmed.text.2')}
    </Text>
    <View>
      <Button
        style={tw`mt-8`}
        title={i18n('showEscrow')}
        tertiary={true}
        wide={false}
        onPress={showEscrow}
      />
      <Button
        style={tw`mt-2`}
        title={i18n('close')}
        secondary={true}
        wide={false}
        onPress={closeOverlay}
      />
    </View>
  </View>
}

/**
 * @description Overlay the buyer sees after seller requested the cancelation of the trade
 */
export const ConfirmCancelTradeRequest = ({ contract, navigation }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [loading, setLoading] = useState(false)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  const ok = async () => {
    setLoading(true)
    const [result, err] = await cancelContract({
      contractId: contract.id,
      // satsPerByte: 1 // TODO fetch fee rate from preferences, note prio suggestions,
    })

    if (result) {
      closeOverlay()
      navigation.replace('yourTrades', {})
    } else if (err) {
      error('Error', err)
    }
    setLoading(false)
  }

  return <View style={tw`flex items-center`}>
    <Headline style={tw`text-center text-white-1 font-baloo text-xl leading-8`}>
      {i18n('contract.cancel.request.title')}
    </Headline>
    <Text style={tw`text-center text-white-1 mt-8`}>
      {i18n(
        'contract.cancel.request.text.1',
        contractIdToHex(contract.id),
        i18n('currency.format.sats', thousands(contract.amount))
      )}
    </Text>
    <Text style={tw`text-center text-white-1 mt-2`}>
      {i18n('contract.cancel.request.text.2')}
    </Text>
    <View>
      <Button
        style={tw`mt-8`}
        title={i18n('contract.cancel.request.ok')}
        tertiary={true}
        wide={false}
        loading={loading}
        onPress={ok}
      />
      <Button
        style={tw`mt-2`}
        title={i18n('contract.cancel.request.back')}
        secondary={true}
        wide={false}
        loading={loading}
        onPress={closeOverlay}
      />
    </View>
  </View>
}

/**
 * @description Overlay the buyer sees after succesful cancelation
 */
const ContractCanceled = ({ contract, navigation }: ConfirmCancelTradeProps) => {
  const [, updateOverlay] = useContext(OverlayContext)
  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  useEffect(() => {
    setTimeout(() => {
      closeOverlay()
      navigation.replace('contract', { contractId: contract.id })
    }, 3000)
  }, [])

  return <View style={tw`flex items-center`}>
    <Headline style={tw`text-center text-white-1 font-baloo text-3xl leading-3xl`}>
      {i18n('yourTrades.tradeCanceled.subtitle')}
    </Headline>
    <View style={tw`flex items-center justify-center w-16 h-16 bg-green rounded-full`}>
      <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color as string} />
    </View>
  </View>
}

/**
 * @description Overlay the seller sees when requesting cancelation
 */
// eslint-disable-next-line max-lines-per-function
const ConfirmCancelTradeSeller = ({ contract, navigation }: ConfirmCancelTradeProps): ReactElement => {
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

/**
 * @description Overlay the buyer sees when intending to cancel trade
 */
const ConfirmCancelTradeBuyer = ({ contract, navigation }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [loading, setLoading] = useState(false)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  const ok = async () => {
    setLoading(true)
    const [result, err] = await cancelContract({
      contractId: contract.id,
      // satsPerByte: 1 // TODO fetch fee rate from preferences, note prio suggestions,
    })

    if (result) {
      saveContract({
        ...contract,
        canceled: true
      })
      updateOverlay({ content: <ContractCanceled contract={contract} navigation={navigation} /> })
    } else if (err) {
      error('Error', err)
    }
    setLoading(false)
  }

  return <View style={tw`flex items-center`}>
    <Headline style={tw`text-center text-white-1 font-baloo text-xl leading-8`}>
      {i18n('contract.cancel.buyer.title')}
    </Headline>
    <Text style={tw`text-center text-white-1 mt-8`}>
      {i18n('contract.cancel.buyer.text.1')}
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

export default ({ contract, navigation }: ConfirmCancelTradeProps): ReactElement => {
  const view = contract.seller.id === account.publicKey ? 'seller' : 'buyer'

  return view === 'seller'
    ? <ConfirmCancelTradeSeller contract={contract} navigation={navigation} />
    : <ConfirmCancelTradeBuyer contract={contract} navigation={navigation} />
}