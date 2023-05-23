import { PaymentDetails } from '../../components/payment/PaymentDetails'
import { useHeaderSetup } from '../../hooks'
import i18n from '../../utils/i18n'

export default () => {
  useHeaderSetup({ title: i18n('form.paymentMethod.edit') })

  return <PaymentDetails origin="paymentMethods" editing />
}
