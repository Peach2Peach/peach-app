import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const SellTitleComponent = () => (
  <Text style={tw`h6`}>
    <Text style={[tw`h6 text-primary-main`]}>{i18n('sell')}</Text> {i18n('bitcoin')}
  </Text>
)

export default SellTitleComponent
