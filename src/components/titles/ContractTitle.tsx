import { Text } from '..'
import { contractIdToHex } from '../../utils/contract'
import { getHeaderStyles } from '../../utils/layout'

type Props = {
  id: string
}
export const ContractTitle = ({ id }: Props) => {
  const { fontSize } = getHeaderStyles()
  return (
    <Text style={fontSize} numberOfLines={1}>
      {contractIdToHex(id)}
    </Text>
  )
}
