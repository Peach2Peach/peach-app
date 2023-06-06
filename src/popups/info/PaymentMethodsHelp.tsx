import { PeachText } from '../../components/text/Text'
import i18n from '../../utils/i18n'

export const PaymentMethodsHelp = () => (
  <>
    <PeachText>{i18n('help.paymentMethods.description.1')}</PeachText>
    <PeachText>{i18n('help.paymentMethods.description.2')}</PeachText>
  </>
)
