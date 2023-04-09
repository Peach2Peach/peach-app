import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import { OverlayContext } from '../../../../contexts/overlay'
import { useValidatedState } from '../../../../hooks'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { EmailInput } from '../../EmailInput'
import Input from '../../Input'
import { CurrencySelection } from '../paymentForms/components'
import { toggleCurrency } from '../paymentForms/utils'
import { hasMultipleAvailableCurrencies } from './utils/hasMultipleAvailableCurrencies'
import { LabelInput } from '../../LabelInput'
import { ReferenceInput } from '../../ReferenceInput'

const emailRules = {
  required: true,
  email: true,
}
const referenceRules = { required: false }

export const Template4 = ({ data, currencies = [], onSubmit, setStepValid, paymentMethod, setFormData }: FormProps) => {
  useContext(OverlayContext)
  const [label, setLabel] = useState(data?.label || '')
  const [email, setEmail, emailIsValid, emailErrors] = useValidatedState(data?.email || '', emailRules)
  const [displayErrors, setDisplayErrors] = useState(false)
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [reference, setReference, , referenceError] = useValidatedState(data?.reference || '', referenceRules)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  let $email = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current
  let $beneficiary = useRef<TextInput>(null).current

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
    }),
    [data.id, label],
  )

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${new Date().getTime()}`,
      label,
      type:
        paymentMethod !== 'giftCard.amazon' ? paymentMethod : ((paymentMethod + '.' + data?.country) as PaymentMethod),
      email,
      beneficiary,
      reference,
      currencies: selectedCurrencies,
      country: data?.country,
    }),
    [data?.country, data?.id, beneficiary, email, label, paymentMethod, reference, selectedCurrencies],
  )

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return emailIsValid && labelErrors.length === 0
  }, [emailIsValid, labelErrors.length])

  const save = () => {
    if (!isFormValid()) return

    onSubmit(buildPaymentData())
  }

  useEffect(() => {
    setStepValid(isFormValid())
    setFormData(buildPaymentData())
  }, [isFormValid, setStepValid, buildPaymentData, setFormData])

  return (
    <>
      <LabelInput
        onChange={setLabel}
        onSubmit={() => $email?.focus()}
        value={label}
        errorMessage={displayErrors ? labelErrors : undefined}
      />
      <EmailInput
        onChange={setEmail}
        onSubmit={() => {
          $beneficiary?.focus()
        }}
        reference={(el: any) => ($email = el)}
        required={true}
        value={email}
        label={i18n('form.emailLong')}
        placeholder={i18n('form.email.placeholder')}
        errorMessage={displayErrors ? emailErrors : undefined}
      />
      <Input
        onChange={setBeneficiary}
        onSubmit={() => {
          $reference?.focus()
        }}
        reference={(el: any) => ($beneficiary = el)}
        value={beneficiary}
        required={false}
        label={i18n('form.beneficiary')}
        placeholder={i18n('form.beneficiary.placeholder')}
        autoCorrect={false}
      />
      <ReferenceInput
        onChange={setReference}
        onSubmit={save}
        reference={(el: any) => ($reference = el)}
        value={reference}
        errorMessage={displayErrors ? referenceError : undefined}
      />

      {paymentMethod !== 'giftCard.amazon' && hasMultipleAvailableCurrencies(paymentMethod) && (
        <CurrencySelection
          paymentMethod={paymentMethod}
          selectedCurrencies={selectedCurrencies}
          onToggle={onCurrencyToggle}
        />
      )}
    </>
  )
}
