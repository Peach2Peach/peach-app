import { Text } from '..'
import tw from '../../styles/tailwind'
import { contractIdToHex } from '../../utils/contract'

export const DisputeContractTitle = ({ id }: { id: string }) => (
  <Text style={tw`h7`} numberOfLines={1}>
    {contractIdToHex(id)}
  </Text>
)
