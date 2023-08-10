import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getHeaderStyles } from '../../../utils/layout'

export const BuyTitleComponent = () => {
  const { fontSize } = getHeaderStyles()
  return (
    <Text style={fontSize}>
      <Text style={[tw`h7 text-success-main`, tw.md`h6`]}>{i18n('buy')}</Text> {i18n('bitcoin')}
    </Text>
  )
}
