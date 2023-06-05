import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type DisputeWonProps = {
  tradeId: string
}

export const DisputeWon = ({ tradeId }: DisputeWonProps) => (
  <>
    <Text>{i18n('dispute.won.text.1', tradeId)}</Text>
    <Text style={tw`mt-3`}>{i18n('dispute.won.text.2')}</Text>
  </>
)
