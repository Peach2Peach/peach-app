import { NETWORK } from '@env'
import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { Text } from '../text'
import { TradeSummaryProps } from './TradeSummary'

export const Escrow = ({ contract, style }: TradeSummaryProps): ReactElement => {
  const openEscrow = () =>
    contract.releaseTxId ? showTransaction(contract.releaseTxId, NETWORK) : showAddress(contract.escrow, NETWORK)

  return (
    <View style={[tw`flex-row items-center justify-center`, style]}>
      <Text onPress={openEscrow} style={tw`underline text-black-2`}>
        {i18n('escrow.viewInExplorer')}
      </Text>
      <Icon id="externalLink" style={tw`w-4 h-4 ml-1`} color={tw`text-primary-main`.color} />
    </View>
  )
}
