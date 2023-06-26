import { View } from 'react-native'
import { Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { iconMap } from '../iconMap'

type Props = Pick<TransactionSummary, 'type' | 'offerId' | 'contractId'>
export const TransactionHeader = ({ type, offerId, contractId }: Props) => (
  <View style={tw`flex-row items-center`}>
    {iconMap[type]}
    <View>
      <Text>{i18n(`wallet.transactionDetails.type.${type}`)}</Text>
    </View>
  </View>
)
