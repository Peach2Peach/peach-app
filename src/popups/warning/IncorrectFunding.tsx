import { View } from 'react-native'
import { PeachText } from '../../components/text/PeachText'
import i18n from '../../utils/i18n'

type Props = {
  utxos: number
}

export const IncorrectFunding = ({ utxos }: Props) => (
  <View>
    <PeachText>{i18n('warning.incorrectFunding.description', String(utxos))}</PeachText>
  </View>
)
