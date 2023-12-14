import PeachText from '../../../components/text/Text'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const OpenDispute = () => (
  <>
    <PeachText>{i18n('dispute.openDispute.text.1')}</PeachText>
    <PeachText style={tw`mt-3`}>{i18n('dispute.openDispute.text.2')}</PeachText>
    <PeachText style={tw`mt-3`}>{i18n('dispute.openDispute.text.3')}</PeachText>
  </>
)
