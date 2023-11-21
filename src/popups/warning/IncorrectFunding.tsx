import { View } from 'react-native'
import { Text } from '../../components'
import i18n from '../../utils/i18n'

type Props = {
  utxos: number
}

export const IncorrectFunding = ({ utxos }: Props) => (
  <View>
    <Text>{i18n('warning.incorrectFunding.description', String(utxos))}</Text>
  </View>
)
