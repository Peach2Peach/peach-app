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

const emailRules = {
  required: true,
  email: true,
}

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

  let $email = useRef<TextInput>(null).current

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
    <View>
      <View>
        <Input
          onChange={setLabel}
          onSubmit={() => $email?.focus()}
          value={label}
          label={i18n('form.paymentMethodName')}
          placeholder={i18n('form.paymentMethodName.placeholder')}
          autoCorrect={false}
          errorMessage={displayErrors ? labelErrors : undefined}
        />
      </View>
      <View style={tw`mt-1`}>
        <EmailInput
          onChange={setEmail}
          onSubmit={save}
          reference={(el: any) => ($email = el)}
          required={true}
          value={email}
          label={i18n('form.email')}
          placeholder={i18n('form.email.placeholder')}
          errorMessage={displayErrors ? emailErrors : undefined}
        />
      </View>
    </View>
  )
}
