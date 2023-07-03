import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import Input, { InputProps } from '../../Input'
import { LabelInput } from '../../LabelInput'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'

const useLabelInput = (paymentData: Partial<PaymentData>) => {
  const [label, setLabel] = useState(paymentData?.label || '')
  const [displayErrors, setDisplayErrors] = useState(false)

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)?.id !== paymentData.id,
    }),
    [paymentData.id, label],
  )
  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])

  return {
    labelInputProps: {
      value: label,
      onChange: setLabel,
      errorMessage: displayErrors ? labelErrors : undefined,
    },
    label,
    setDisplayErrors,
    labelErrors,
  }
}

const useReceiveAddressInput = (paymentData: Partial<PaymentData>) => {
  const [receiveAddress, setReceiveAddress] = useState(paymentData?.receiveAddress || '')
  const [displayErrors, setDisplayErrors] = useState(false)

  const receiveAddressRules = useMemo(
    () => ({
      required: true,
      bitcoinAddress: true,
    }),
    [],
  )

  const receiveAddressErrors = useMemo(
    () => getErrorsInField(receiveAddress, receiveAddressRules),
    [receiveAddress, receiveAddressRules],
  )

  return {
    receiveAddressInputProps: {
      value: receiveAddress,
      onChange: setReceiveAddress,
      errorMessage: displayErrors ? receiveAddressErrors : undefined,
    },
    receiveAddress,
    setDisplayErrors,
    receiveAddressErrors,
  }
}

const useTemplate10Setup = ({
  data,
  currencies = [],
  onSubmit,
  setStepValid,
  paymentMethod,
  setFormData,
}: FormProps) => {
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const {
    receiveAddressInputProps,
    receiveAddressErrors,
    setDisplayErrors: setDisplayReceiveAddressErrors,
    receiveAddress,
  } = useReceiveAddressInput(data)

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayReceiveAddressErrors(true)
    return labelErrors.length === 0 && receiveAddressErrors.length === 0
  }, [labelErrors.length, receiveAddressErrors.length, setDisplayLabelErrors, setDisplayReceiveAddressErrors])

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      receiveAddress,
      currencies,
    }),
    [currencies, data?.id, label, paymentMethod, receiveAddress],
  )

  const save = () => {
    if (!isFormValid()) return

    onSubmit(buildPaymentData())
  }

  useEffect(() => {
    setStepValid(isFormValid())
    setFormData(buildPaymentData())
  }, [buildPaymentData, isFormValid, setFormData, setStepValid])

  return {
    labelInputProps,
    receiveAddressInputProps: {
      ...receiveAddressInputProps,
      onSubmit: save,
    },
  }
}

const ReceiveAddressInput = (props: InputProps) => (
  <Input
    label={i18n('form.receiveAddress')}
    placeholder={i18n('form.receiveAddress.placeholder')}
    autoCorrect={false}
    {...props}
  />
)

export const Template10 = (props: FormProps) => {
  const { labelInputProps, receiveAddressInputProps } = useTemplate10Setup(props)

  let $receiveAddressInput = useRef<TextInput>().current

  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $receiveAddressInput?.focus()} />
      <ReceiveAddressInput {...receiveAddressInputProps} reference={(el: any) => ($receiveAddressInput = el)} />
    </>
  )
}
