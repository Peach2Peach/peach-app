import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const DisputeDisclaimer = () => (
  <>
    <Text>{i18n('chat.disputeDisclaimer.1')}</Text>
    <Text style={tw`mt-3`}>
      {i18n('chat.disputeDisclaimer.2')}
      <Text style={tw`underline`}>{i18n('chat.disputeDisclaimer.3')}</Text>
      {i18n('chat.disputeDisclaimer.4')}
    </Text>
    <Text style={tw`mt-3`}>{i18n('chat.disputeDisclaimer.5')}</Text>
  </>
)
