import React, { ReactElement, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField, useValidatedState } from '../../../../utils/validation'
import Input from '../../Input'

const beneficiaryRules = { required: true }
const notRequired = { required: false }
const ibanRules = { required: true, iban: true }
const bicRules = { required: true, bic: true }

export const SEPA = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  onChange,
}: PaymentMethodFormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [beneficiary, setBeneficiary, beneficiaryIsValid, beneficiaryErrors] = useValidatedState(
    data?.beneficiary || '',
    beneficiaryRules,
  )
  const [iban, setIBAN, ibanIsValid, ibanErrors] = useValidatedState(data?.iban || '', ibanRules)
  const [bic, setBIC, bicIsValid, bicErrors] = useValidatedState(data?.bic || '', bicRules)
  const [address, setAddress, addressIsValid, addressErrors] = useValidatedState(data?.address || '', notRequired)
  const [reference, setReference, referenceIsValid, referenceErrors] = useValidatedState(
    data?.reference || '',
    notRequired,
  )
  const [displayErrors, setDisplayErrors] = useState(false)

  let $beneficiary = useRef<TextInput>(null).current
  let $iban = useRef<TextInput>(null).current
  let $bic = useRef<TextInput>(null).current
  let $address = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const labelRules = {
    required: true,
    duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
  }

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])

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

  const isFormValid = () => {
    setDisplayErrors(true)
    return (
      labelErrors.length === 0 && beneficiaryIsValid && ibanIsValid && bicIsValid && addressIsValid && referenceIsValid
    )
  }

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
          isValid={labelErrors.length === 0}
          autoCorrect={false}
          errorMessage={displayErrors ? labelErrors : undefined}
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
          isValid={beneficiaryIsValid}
          autoCorrect={false}
          errorMessage={displayErrors ? beneficiaryErrors : undefined}
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
          isValid={ibanIsValid}
          autoCorrect={false}
          errorMessage={displayErrors ? ibanErrors : undefined}
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
          isValid={bicIsValid}
          autoCorrect={false}
          errorMessage={displayErrors ? bicErrors : undefined}
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
          isValid={addressIsValid}
          autoCorrect={false}
          errorMessage={displayErrors ? addressErrors : undefined}
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
          isValid={referenceIsValid}
          autoCorrect={false}
          errorMessage={displayErrors ? referenceErrors : undefined}
        />
      </View>
    </View>
  )
}
