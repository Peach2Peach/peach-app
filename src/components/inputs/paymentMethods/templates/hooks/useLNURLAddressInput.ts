import { useMemo, useState } from 'react'
import { getErrorsInField } from '../../../../../utils/validation'
import i18n from '../../../../../utils/i18n'

export const useLNURLAddressInput = (paymentData: Partial<PaymentData>) => {
  const [lnurlAddress, setLNURLAddress] = useState(paymentData?.lnurlAddress || '')
  const [displayErrors, setDisplayErrors] = useState(false)

  const lnurlAddressRules = useMemo(() => ({ required: true, email: true }), [])

  const lnurlAddressErrors = useMemo(
    () => getErrorsInField(lnurlAddress, lnurlAddressRules),
    [lnurlAddress, lnurlAddressRules],
  )

  return {
    lnurlAddressInputProps: {
      value: lnurlAddress,
      label: i18n('form.address.lnurl'),
      placeholder: i18n('form.address.lnurl.placeholder'),
      onChange: setLNURLAddress,
      errorMessage: displayErrors ? lnurlAddressErrors : undefined,
    },
    lnurlAddress,
    setDisplayErrors,
    lnurlAddressErrors,
  }
}
