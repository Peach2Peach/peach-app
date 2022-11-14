import React, { ReactElement, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from '.'
import { useValidatedState } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import Input from '../../Input'

const phoneRules = { required: true, phone: true }

export const Twint = ({ forwardRef, data, currencies = [], onSubmit, setStepValid }: FormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone, phoneIsValid, phoneErrors] = useValidatedState(data?.phone || '', phoneRules)
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [displayErrors, setDisplayErrors] = useState(false)

  let $phone = useRef<TextInput>(null).current
  let $beneficiary = useRef<TextInput>(null).current

  const labelRules = {
    required: true,
    duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
  }

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])

  const buildPaymentData = (): PaymentData & TwintData => ({
    id: data?.id || `twint-${new Date().getTime()}`,
    label,
    type: 'twint',
    phone,
    beneficiary,
    currencies: data?.currencies || currencies,
  })

  const isFormValid = () => {
    setDisplayErrors(true)
    return phoneIsValid && labelErrors.length === 0
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
          onSubmit={() => $phone?.focus()}
          value={label}
          label={i18n('form.paymentMethodName')}
          placeholder={i18n('form.paymentMethodName.placeholder')}
          isValid={labelErrors.length === 0}
          autoCorrect={false}
          errorMessage={displayErrors ? labelErrors : undefined}
        />
      </View>
      <View style={tw`mt-6`}>
        <Input
          onChange={(number: string) => {
            setPhone((number.length && !/\+/gu.test(number) ? `+${number}` : number).replace(/[^0-9+]/gu, ''))
          }}
          onSubmit={() => {
            setPhone((number: string) => (!/\+/gu.test(number) ? `+${number}` : number).replace(/[^0-9+]/gu, ''))
            $beneficiary?.focus()
          }}
          reference={(el: any) => ($phone = el)}
          value={phone}
          label={i18n('form.phone')}
          placeholder={i18n('form.phone.placeholder')}
          isValid={phoneIsValid}
          autoCorrect={false}
          errorMessage={displayErrors ? phoneErrors : undefined}
        />
      </View>
      <View style={tw`mt-6`}>
        <Input
          onChange={setBeneficiary}
          onSubmit={save}
          reference={(el: any) => ($beneficiary = el)}
          value={beneficiary}
          required={false}
          label={i18n('form.name')}
          placeholder={i18n('form.name.placeholder')}
          autoCorrect={false}
        />
      </View>
    </View>
  )
}
