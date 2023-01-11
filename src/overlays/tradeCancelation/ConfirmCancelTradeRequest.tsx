import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import { Headline, PrimaryButton, Text } from '../../components'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import { getOfferHexIdFromContract, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { confirmContractCancelation, rejectContractCancelation } from '../../utils/peachAPI'
import { thousands } from '../../utils/string'
import { ConfirmCancelTradeProps } from '../ConfirmCancelTrade'
import { ContractCanceled } from './ContractCanceled'

/**
 * @description Overlay the buyer sees after seller requested the cancelation of the trade
 */
export const ConfirmCancelTradeRequest = ({ contract }: ConfirmCancelTradeProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)
  const [, updateOverlay] = useContext(OverlayContext)
  const [loading, setLoading] = useState(false)

  const closeOverlay = () => updateOverlay({ visible: false })
  const confirm = async () => {
    setLoading(true)
    const [result, err] = await confirmContractCancelation({ contractId: contract.id })

    if (result) {
      saveContract({
        ...contract,
        canceled: true,
        cancelationRequested: false,
      })
      updateOverlay({ content: <ContractCanceled contract={contract} />, visible: true })
      navigation.navigate('yourTrades')
    } else if (err) {
      error('Error', err)
      updateMessage({
        msgKey: err?.error || 'GENERAL_ERROR',
        level: 'ERROR',
        action: {
          callback: () => navigation.navigate('contact'),
          label: i18n('contactUs'),
          icon: 'mail',
        },
      })
    }
    setLoading(false)
  }

  const reject = async () => {
    setLoading(true)
    const [result, err] = await rejectContractCancelation({ contractId: contract.id })

    if (result) {
      saveContract({
        ...contract,
        cancelationRequested: false,
      })
      closeOverlay()
      navigation.navigate('contract', { contractId: contract.id })
    } else if (err) {
      error('Error', err)
    }
    setLoading(false)
  }

  return (
    <View style={tw`flex items-center`}>
      <Headline style={tw`text-xl leading-8 text-center text-white-1 font-baloo`}>
        {i18n('contract.cancel.request.title')}
      </Headline>
      <Text style={tw`mt-8 text-center text-white-1`}>
        {i18n(
          'contract.cancel.request.text.1',
          getOfferHexIdFromContract(contract),
          i18n('currency.format.sats', thousands(contract.amount)),
        )}
      </Text>
      <Text style={tw`mt-2 text-center text-white-1`}>{i18n('contract.cancel.request.text.2')}</Text>
      <View>
        <PrimaryButton style={tw`mt-8`} loading={loading} onPress={confirm} narrow>
          {i18n('contract.cancel.request.ok')}
        </PrimaryButton>
        <PrimaryButton style={tw`mt-2`} loading={loading} onPress={reject} narrow>
          {i18n('contract.cancel.request.back')}
        </PrimaryButton>
      </View>
    </View>
  )
}
