import { ParsedPeachText } from '../../components/text/ParsedPeachText'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { goToShiftCrypto } from '../../utils/web/goToShiftCrypto'

export const WithdrawingFundsHelp = () => (
  <ParsedPeachText
    parse={[
      {
        pattern: new RegExp(i18n('wallet.withdraw.help.text.link'), 'u'),
        style: tw`underline`,
        onPress: goToShiftCrypto,
      },
    ]}
  >
    {i18n('wallet.withdraw.help.text')}
  </ParsedPeachText>
)
