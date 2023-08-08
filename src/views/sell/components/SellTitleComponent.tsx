import { ParsedPeachText } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getHeaderStyles } from '../../../utils/layout'

export const SellTitleComponent = () => {
  const { fontSize } = getHeaderStyles()
  return (
    <ParsedPeachText
      style={fontSize}
      parse={[{ pattern: new RegExp(i18n('sell.title.highlight'), 'u'), style: tw`text-primary-main` }]}
    >
      {i18n('sell.title')}
    </ParsedPeachText>
  )
}
