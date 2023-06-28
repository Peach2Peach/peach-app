import { View } from 'react-native'
import { Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { iconMap } from '../iconMap'
import { getTxDetailsTitle } from '../../helpers/getTxDetailsTitle'

type Props = {
  transaction: TransactionSummary
}

export const TranscactionDetailsHeader = ({ transaction }: Props) => (
  <View>
    <Text style={tw`text-center text-black-2`}>{i18n('wallet.transaction.type')}</Text>
    <View style={tw`flex flex-row justify-center`}>
      {iconMap[transaction.type]}
      <Text style={tw`ml-2 text-center subtitle-1`}>{getTxDetailsTitle(transaction)}</Text>
    </View>
  </View>
)
