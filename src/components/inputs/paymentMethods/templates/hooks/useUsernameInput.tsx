import { useState } from 'react'
import { useValidatedState } from '../../../../../hooks'
import i18n from '../../../../../utils/i18n'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'

const userNameRules = { required: true, userName: true }
export const useUsernameInput = (data: FormProps['data']) => {
  const { type: paymentMethod } = data
  const [displayErrors, setDisplayErrors] = useState(false)
  const [userName, setUserName, userNameIsValid, userNameErrors] = useValidatedState(data?.userName || '', userNameRules)

  return {
    userNameInputProps: {
      value: userName,
      required: true,
      onChange: setUserName,
      errorMessage: displayErrors ? userNameErrors : undefined,
      label: paymentMethod === 'chippercash' ? i18n('form.chippertag') : i18n('form.userName'),
      placeholder:
        paymentMethod === 'chippercash' ? i18n('form.chippertag.placeholder') : i18n('form.userName.placeholder'),
    },
    userName,
    setDisplayErrors,
    userNameIsValid,
  }
}
