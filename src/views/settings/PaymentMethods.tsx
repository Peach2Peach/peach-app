import { ReactElement } from 'react'
import PaymentDetails from '../../components/payment/PaymentDetails'
import { useHeaderSetup } from '../../hooks'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'

export default (): ReactElement => {
  useHeaderSetup({ title: i18n('form.paymentMethod.edit') })

  return <PaymentDetails origin="paymentMethods" paymentData={account.paymentData} editing={true} />
}
