import { NETWORK } from '@env'
import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { Headline, Text } from '../text'
import { TradeSummaryProps } from './TradeSummary'

export const Escrow = ({ contract, style }: TradeSummaryProps): ReactElement => (
  <View style={style}>
    <Headline style={tw`normal-case text-grey-2`}>
      {i18n(contract.releaseTxId ? 'contract.summary.releaseTx' : 'contract.summary.escrow')}
    </Headline>
    <Pressable
      style={tw`flex-row items-center justify-center`}
      onPress={() =>
        contract.releaseTxId
          ? showTransaction(contract.releaseTxId as string, NETWORK)
          : showAddress(contract.escrow, NETWORK)
      }
    >
      <Text style={tw`underline text-grey-2`}>{i18n('escrow.viewInExplorer')}</Text>
      <Icon id="link" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color} />
    </Pressable>
  </View>
)
