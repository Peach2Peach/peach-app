import React, { ReactElement, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from '.'
import { OverlayContext } from '../../../../contexts/overlay'
import { useValidatedState } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { EmailInput } from '../../EmailInput'
import Input from '../../Input'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'

const emailRules = {
  required: true,
  email: true,
}
const referenceRules = { required: false }

export const GiftCardAmazon = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  setStepValid,
}: FormProps): ReactElement => {
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

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const labelRules = {
    required: true,
    duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
  }

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])

  const buildPaymentData = (): PaymentData & AmazonGiftCardData => ({
    id: data?.id || `giftCard.amazon-${new Date().getTime()}`,
    label,
    type: `giftCard.amazon.${data?.country}` as PaymentMethod,
    email,
    currencies: data?.currencies || currencies,
    country: data?.country,
  })

  const isFormValid = () => {
    setDisplayErrors(true)
    return emailIsValid && labelErrors.length === 0
  }
  const save = () => {
    if (!isFormValid()) return

    onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    save,
  }))

  useEffect(() => {
    setStepValid(isFormValid())
  }, [isFormValid, setStepValid])

  return (
    <>
      <Input
        onChange={setLabel}
        onSubmit={() => $email?.focus()}
        value={label}
        label={i18n('form.paymentMethodName')}
        placeholder={i18n('form.paymentMethodName.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? labelErrors : undefined}
      />
      <EmailInput
        onChange={setEmail}
        onSubmit={() => {
          $reference?.focus()
        }}
        reference={(el: any) => ($email = el)}
        required={true}
        value={email}
        label={i18n('form.emailLong')}
        placeholder={i18n('form.email.placeholder')}
        errorMessage={displayErrors ? emailErrors : undefined}
      />
      <Input
        onChange={setReference}
        onSubmit={() => {
          $beneficiary?.focus()
        }}
        reference={(el: any) => ($reference = el)}
        value={reference}
        required={false}
        label={i18n('form.reference')}
        placeholder={i18n('form.reference.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? referenceError : undefined}
      />
      <Input
        onChange={setBeneficiary}
        onSubmit={save}
        reference={(el: any) => ($beneficiary = el)}
        value={beneficiary}
        required={false}
        label={i18n('form.beneficiary')}
        placeholder={i18n('form.beneficiary.placeholder')}
        autoCorrect={false}
      />
      {data?.country && (
        <CurrencySelection
          paymentMethod={`giftCard.amazon.${data?.country}`}
          selectedCurrencies={selectedCurrencies}
          onToggle={onCurrencyToggle}
        />
      )}
    </>
  )
}
