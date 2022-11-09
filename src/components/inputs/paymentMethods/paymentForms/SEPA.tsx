import React, { ReactElement, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { validateForm } from '../../../../utils/validation'
import { useValidation } from '../../../../utils/validation/useValidation'
import Input from '../../Input'

// eslint-disable-next-line max-lines-per-function
export const SEPA = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  onChange,
}: PaymentMethodFormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [iban, setIBAN] = useState(data?.iban || '')
  const [bic, setBIC] = useState(data?.bic || '')
  const [address, setAddress] = useState(data?.address || '')
  const [reference, setReference] = useState(data?.reference || '')

  let $beneficiary = useRef<TextInput>(null).current
  let $iban = useRef<TextInput>(null).current
  let $bic = useRef<TextInput>(null).current
  let $address = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField } = useValidation({
    label,
    beneficiary,
    iban,
    bic,
    address,
    reference,
  })

  const buildPaymentData = (): PaymentData & SEPAData => ({
    id: data?.id || `sepa-${new Date().getTime()}`,
    label,
    type: 'sepa',
    beneficiary,
    iban,
    bic,
    address,
    reference,
    currencies: data?.currencies || currencies,
  })

  const isFormValid = () =>
    validateForm([
      {
        value: label,
        rulesToCheck: {
          required: true,
          duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
        },
      },
      {
        value: beneficiary,
        rulesToCheck: {
          required: true,
        },
      },
      {
        value: iban,
        rulesToCheck: {
          required: true,
          iban: true,
        },
      },
      {
        value: bic,
        rulesToCheck: {
          required: true,
          bic: true,
        },
      },
      {
        value: address,
        rulesToCheck: {
          required: false,
        },
      },
      {
        value: reference,
        rulesToCheck: {
          required: false,
        },
      },
    ])

  const save = () => {
    if (!isFormValid()) return

    onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    buildPaymentData,
    isFormValid,
    save,
  }))

  useEffect(() => {
    if (onChange) onChange(buildPaymentData())
  }, [label, iban, beneficiary, bic, address, reference])

  return (
    <View>
      <View>
        <Input
          onChange={setLabel}
          onSubmit={() => $beneficiary?.focus()}
          value={label}
          label={i18n('form.paymentMethodName')}
          placeholder={i18n('form.paymentMethodName.placeholder')}
          isValid={!isFieldInError('label')}
          autoCorrect={false}
          errorMessage={getErrorsInField('label')}
        />
      </View>
      <View style={tw`mt-6`}>
        <Input
          onChange={setBeneficiary}
          onSubmit={() => $iban?.focus()}
          reference={(el: any) => ($beneficiary = el)}
          value={beneficiary}
          label={i18n('form.beneficiary')}
          placeholder={i18n('form.beneficiary.placeholder')}
          isValid={!isFieldInError('beneficiary')}
          autoCorrect={false}
          errorMessage={getErrorsInField('beneficiary')}
        />
      </View>
      <View style={tw`mt-6`}>
        <Input
          onChange={setIBAN}
          onSubmit={() => $bic?.focus()}
          reference={(el: any) => ($iban = el)}
          value={iban}
          label={i18n('form.iban')}
          placeholder={i18n('form.iban.placeholder')}
          isValid={!isFieldInError('iban')}
          autoCorrect={false}
          errorMessage={getErrorsInField('iban')}
        />
      </View>
      <View style={tw`mt-6`}>
        <Input
          onChange={setBIC}
          onSubmit={() => $address?.focus()}
          reference={(el: any) => ($bic = el)}
          value={bic}
          required={true}
          label={i18n('form.bic')}
          placeholder={i18n('form.bic.placeholder')}
          isValid={!isFieldInError('bic')}
          autoCorrect={false}
          errorMessage={getErrorsInField('bic')}
        />
      </View>
      <View style={tw`mt-6`}>
        <Input
          onChange={setAddress}
          onSubmit={() => $reference?.focus()}
          reference={(el: any) => ($address = el)}
          value={address}
          required={false}
          label={i18n('form.address')}
          placeholder={i18n('form.address.placeholder')}
          isValid={!isFieldInError('address')}
          autoCorrect={false}
          errorMessage={getErrorsInField('address')}
        />
      </View>
      <View style={tw`mt-6`}>
        <Input
          onChange={setReference}
          onSubmit={save}
          reference={(el: any) => ($reference = el)}
          value={reference}
          required={false}
          label={i18n('form.reference')}
          placeholder={i18n('form.reference.placeholder')}
          isValid={!isFieldInError('reference')}
          autoCorrect={false}
          errorMessage={getErrorsInField('reference')}
        />
      </View>
    </View>
  )
}
