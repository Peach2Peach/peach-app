import { PeachText } from '../../../components/text/PeachText'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

declare type Props = { view: ContractViewer }

export const DisputeRaisedSuccess = ({ view }: Props) => (
  <PeachText style={tw`mb-3`}>{i18n(`dispute.raised.text.${view}`)}</PeachText>
)
