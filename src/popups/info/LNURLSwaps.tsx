import { ParsedPeachText } from '../../components/text/ParsedPeachText'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const LNURLSwaps = () => (
  <ParsedPeachText
    parse={[
      {
        pattern: new RegExp(i18n.break('help.lnurl.description.bold'), 'u'),
        style: tw`font-baloo-bold`,
      },
    ]}
  >
    {i18n('help.lnurl.description')}
  </ParsedPeachText>
)
