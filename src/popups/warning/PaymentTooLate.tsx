import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const PaymentTooLate = () => (
  <>
    <Text style={tw`mb-3 body-m text-black-1`}>{i18n('help.tooLate.text.1')}</Text>
    <Text style={tw`body-m text-black-1`}>{i18n('help.tooLate.text.2')}</Text>
  </>
)
