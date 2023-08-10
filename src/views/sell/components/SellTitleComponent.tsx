import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getHeaderStyles } from '../../../utils/layout'

export const SellTitleComponent = () => {
  const { fontSize } = getHeaderStyles()
  return (
    <Text style={fontSize}>
      <Text style={[...fontSize, tw`text-primary-main`]}>{i18n('sell')}</Text> {i18n('bitcoin')}
    </Text>
  )
}
