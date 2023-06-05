import { PeachText } from '../../components/text/Text'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const DisputeDisclaimer = () => (
  <>
    <PeachText>{i18n('chat.disputeDisclaimer.1')}</PeachText>
    <PeachText style={tw`mt-3`}>
      {i18n('chat.disputeDisclaimer.2')}
      <PeachText style={tw`underline`}>{i18n('chat.disputeDisclaimer.3')}</PeachText>
      {i18n('chat.disputeDisclaimer.4')}
    </PeachText>
    <PeachText style={tw`mt-3`}>{i18n('chat.disputeDisclaimer.5')}</PeachText>
  </>
)
