import { Text } from '..'
import tw from '../../styles/tailwind'
import { contractIdToHex } from '../../utils/contract'

type Props = {
  id: string
}
export const ContractTitle = ({ id }: Props) => (
  <Text style={tw`h6`} numberOfLines={1}>
    {contractIdToHex(id)}
  </Text>
)
