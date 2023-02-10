import React from 'react'
import { Text } from '..'
import tw from '../../styles/tailwind'
import { contractIdToHex } from '../../utils/contract'
import i18n from '../../utils/i18n'

type ContractChatTitleProps = {
  id: string
}
export const ContractChatTitle = ({ id }: ContractChatTitleProps) => {
  const part1 = i18n('contract.trade', contractIdToHex(id))
  const part2 = i18n('chat')
  return (
    <Text style={tw`h6`} numberOfLines={1}>
      {part1} - {part2 && <Text style={[tw`h6 text-black-2`]}>{part2}</Text>}
    </Text>
  )
}
export default ContractChatTitle
