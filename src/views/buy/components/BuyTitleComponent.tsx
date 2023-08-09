import { ParsedPeachText } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getHeaderStyles } from '../../../utils/layout'

export const BuyTitleComponent = () => {
  const { fontSize } = getHeaderStyles()
  return (
    <ParsedPeachText
      style={fontSize}
      parse={[{ pattern: new RegExp(i18n('buy.title.highlight'), 'u'), style: tw`text-success-main` }]}
    >
      {i18n('buy.title')}
    </ParsedPeachText>
  )
}
