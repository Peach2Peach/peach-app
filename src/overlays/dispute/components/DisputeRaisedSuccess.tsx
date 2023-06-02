import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

declare type DisputeRaisedSuccessProps = { view: ContractViewer }

export default ({ view }: DisputeRaisedSuccessProps) => (
  <Text style={tw`mb-3`}>{i18n(`dispute.raised.text.${view}`)}</Text>
)
