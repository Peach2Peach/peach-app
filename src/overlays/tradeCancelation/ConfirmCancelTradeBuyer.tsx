import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import shallow from 'zustand/shallow'
import { Button, Headline, Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import { useUserDataStore } from '../../store'
import tw from '../../styles/tailwind'
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
  const { setContract } = useUserDataStore(
    (state) => ({
      setContract: state.setContract,
    }),
    shallow,
  )
  const [loading, setLoading] = useState(false)
  const closeOverlay = () => updateOverlay({ content: null, showCloseButton: true })

  const ok = async () => {
    setLoading(true)
    const [result, err] = await cancelContract({
      contractId: contract.id,
    })

    if (result) {
      setContract({
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
  )
}
