import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'

import { Button, Headline, Text } from '../components'
import Icon from '../components/Icon'
import { OverlayContext } from '../contexts/overlay'
import tw from '../styles/tailwind'
import { account } from '../utils/account'
import { saveContract } from '../utils/contract'
import i18n from '../utils/i18n'
import { error } from '../utils/log'
import { StackNavigation } from '../utils/navigation'
import { cancelContract } from '../utils/peachAPI'

type ConfirmCancelTradeProps = {
  contract: Contract,
  navigation: StackNavigation
}

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

const ConfirmCancelTradeSeller = ({ contract, navigation }: ConfirmCancelTradeProps): ReactElement => {
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