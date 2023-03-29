import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const BuyTitleComponent = () => (
  <Text style={tw`h6`}>
    <Text style={[tw`h6 text-success-main`]}>{i18n('buy')}</Text> {i18n('bitcoin')}
  </Text>
)
