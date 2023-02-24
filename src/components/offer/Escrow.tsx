import { NETWORK } from '@env'
import React, { ReactElement } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import tw from '../../styles/tailwind'
import { showAddress, showTransaction } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { Text } from '../text'

type EscrowProps = ComponentProps & {
  contract: Contract
}
export const Escrow = ({ contract, style }: EscrowProps): ReactElement => {
  const openEscrow = () =>
    contract.releaseTxId ? showTransaction(contract.releaseTxId, NETWORK) : showAddress(contract.escrow, NETWORK)

  return (
    <TouchableOpacity
      onPress={openEscrow}
      style={[tw`flex-row items-center justify-center px-2 border rounded-lg border-primary-main`, style]}
    >
      <Text style={tw`button-medium text-primary-main`}>{i18n('escrow')}</Text>
      <Icon id="externalLink" style={tw`w-3 h-3 ml-1 -mt-px`} color={tw`text-primary-main`.color} />
    </TouchableOpacity>
  )
}
