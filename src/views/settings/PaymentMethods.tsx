import { ReactElement, useState } from 'react'
import PaymentDetails from '../../components/payment/PaymentDetails'
import { useHeaderSetup } from '../../hooks'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'

export default (): ReactElement => {
  useHeaderSetup({ title: i18n('form.paymentMethod.edit') })

  const [, setUpdate] = useState(0)
  const dummy = () => setUpdate(Math.random())

  return (
    <PaymentDetails origin="paymentMethods" paymentData={account.paymentData} setMeansOfPayment={dummy} editing={true} />
  )
}
