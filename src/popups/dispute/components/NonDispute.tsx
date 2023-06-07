import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type NonDisputeProps = {
  tradeId: string
}

export default ({ tradeId }: NonDisputeProps) => (
  <>
    <Text style={tw`body-m text-black-1`}>{i18n('dispute.closed.text.1', tradeId)}</Text>
    <Text style={tw`mt-3 body-m text-black-1`}>{i18n('dispute.closed.text.2')}</Text>
  </>
)
