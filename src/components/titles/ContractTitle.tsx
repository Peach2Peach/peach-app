import React from 'react'
import { Text } from '..'
import tw from '../../styles/tailwind'
import { contractIdToHex } from '../../utils/contract'
import i18n from '../../utils/i18n'

type ContractTitleProps = {
  id: string
}
export const ContractTitle = ({ id }: ContractTitleProps) => (
  <Text style={tw`h6`} numberOfLines={1}>
    {i18n('contract.trade', contractIdToHex(id))}
  </Text>
)
export default ContractTitle
