import React from 'react'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { contractIdToHex } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { formatNumberWithSuffix } from '../../../utils/string'

type ContractTitleProps = {
  id: string
  amount?: number
}
export const ContractTitle = ({ id, amount }: ContractTitleProps) => {
  const part1 = i18n('contract.trade', contractIdToHex(id))
  const part2 = amount ? i18n('currency.format.sats', formatNumberWithSuffix(amount)) : null
  return (
    <Text style={tw`h6`} numberOfLines={1}>
      {part1} - {part2 && <Text style={[tw`h6 text-black-2`]}>{part2}</Text>}
    </Text>
  )
}
export default ContractTitle
