import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import { Headline, PrimaryButton, Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import tw from '../../styles/tailwind'
import { saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { cancelContract } from '../../utils/peachAPI'
import { ConfirmCancelTradeProps } from '../ConfirmCancelTrade'
import { ContractCanceled } from './ContractCanceled'

/**
 * @description Overlay the buyer sees when intending to cancel trade
 */
export const ConfirmCancelTradeBuyer = ({ contract, navigation }: ConfirmCancelTradeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [loading, setLoading] = useState(false)

  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  const ok = async () => {
    setLoading(true)
    const [result, err] = await cancelContract({
      contractId: contract.id,
    })

    if (result) {
      saveContract({
        ...contract,
        canceled: true,
      })
      updateOverlay({ content: <ContractCanceled contract={contract} navigation={navigation} /> })
    } else if (err) {
      error('Error', err)
    }
    setLoading(false)
  }

  return (
    <View style={tw`flex items-center`}>
      <Headline style={tw`text-center text-white-1 font-baloo text-xl leading-8`}>
        {i18n('contract.cancel.title')}
      </Headline>
      <Text style={tw`text-center text-white-1 mt-8`}>{i18n('contract.cancel.text')}</Text>
      <View>
        <PrimaryButton style={tw`mt-8`} loading={loading} onPress={closeOverlay} narrow>
          {i18n('contract.cancel.confirm.back')}
        </PrimaryButton>
        <PrimaryButton style={tw`mt-2`} loading={loading} onPress={ok} narrow>
          {i18n('contract.cancel.confirm.ok')}
        </PrimaryButton>
      </View>
    </View>
  )
}
