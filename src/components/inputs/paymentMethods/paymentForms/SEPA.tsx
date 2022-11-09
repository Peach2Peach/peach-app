import React, { ReactElement, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField, validateForm } from '../../../../utils/validation'
import { useValidation } from '../../../../utils/validation/useValidation'
import Input from '../../Input'

// eslint-disable-next-line max-lines-per-function, max-statements
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

  const { isFieldInError } = useValidation({
    label,
    beneficiary,
    iban,
    bic,
    address,
    reference,
  })
  const labelRules = {
    required: true,
    duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
  }
  const beneficiaryRules = { required: true }
  const notRequired = { required: false }
  const ibanRules = { required: true, iban: true }
  const bicRules = { required: true, bic: true }

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])
  const beneficiaryErrors = useMemo(
    () => getErrorsInField(beneficiary, beneficiaryRules),
    [beneficiary, beneficiaryRules],
  )
  const ibanErrors = useMemo(() => getErrorsInField(iban, ibanRules), [iban, ibanRules])
  const bicErrors = useMemo(() => getErrorsInField(bic, bicRules), [bic, bicRules])
  const addressErrors = useMemo(() => getErrorsInField(address, notRequired), [address, notRequired])
  const referenceErrors = useMemo(() => getErrorsInField(reference, notRequired), [reference, notRequired])

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
        rulesToCheck: labelRules,
      },
      {
        value: beneficiary,
        rulesToCheck: beneficiaryRules,
      },
      {
        value: iban,
        rulesToCheck: ibanRules,
      },
      {
        value: bic,
        rulesToCheck: bicRules,
      },
      {
        value: address,
        rulesToCheck: notRequired,
      },
      {
        value: reference,
        rulesToCheck: notRequired,
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
          errorMessage={labelErrors}
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
          errorMessage={beneficiaryErrors}
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
          errorMessage={ibanErrors}
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
          errorMessage={bicErrors}
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
          errorMessage={addressErrors}
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
          errorMessage={referenceErrors}
        />
      </View>
    </View>
  )
}
