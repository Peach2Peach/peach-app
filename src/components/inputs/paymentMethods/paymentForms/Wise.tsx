/* eslint-disable complexity */
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, Pressable, TextInput, View } from 'react-native'
import { PaymentMethodForm } from '.'
import tw from '../../../../styles/tailwind'
import { addPaymentData, getPaymentData, removePaymentData } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import { Fade } from '../../../animation'
import Button from '../../../Button'
import Icon from '../../../Icon'
import { Text } from '../../../text'
import { HorizontalLine } from '../../../ui'
import Input from '../../Input'
const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function, max-statements
export const Wise: PaymentMethodForm = ({ style, view, data, onSubmit, onCancel }) => {
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [id, setId] = useState(data?.id || '')
  const [email, setEmail] = useState(data?.email || '')
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [iban, setIBAN] = useState(data?.IBAN || '')
  const [bic, setBIC] = useState(data?.bic || '')
  const [ukSortCode, setUKSortCode] = useState(data?.ukSortCode || '')
  const [ukBankAccount, setUKBankAccount] = useState(data?.ukBankAccount || '')
  let $id = useRef<TextInput>(null).current
  let $email = useRef<TextInput>(null).current
  let $beneficiary = useRef<TextInput>(null).current
  let $iban = useRef<TextInput>(null).current
  let $bic = useRef<TextInput>(null).current
  let $ukSortCode = useRef<TextInput>(null).current
  let $ukBankAccount = useRef<TextInput>(null).current
  const anyFieldSet = !!(email || (beneficiary && (iban || bic || (ukSortCode && ukBankAccount))))

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { id, email, beneficiary, iban, bic, ukSortCode, ukBankAccount },
    rules,
    messages: getMessages()
  })

  const save = () => {
    validate({
      id: {
        required: true,
        duplicate: view === 'new' && getPaymentData(id)
      },
      email: {
        required: !iban && !bic && !(ukSortCode && ukBankAccount),
        email: true
      },
      beneficiary: {
        required: !email,
        iban: true
      },
      iban: {
        required: !email && !bic && !(ukSortCode && ukBankAccount),
        iban: true
      },
      bic: {
        required: !email && !iban && !(ukSortCode && ukBankAccount),
        bic: true
      },
      ukSortCode: {
        required: !email && !iban && !bic,
        ukSortCode: true
      },
      ukBankAccount: {
        required: !email && !iban && !bic,
        ukBankAccount: true
      },
    })
    if (!isFormValid()) return

    if (view === 'edit') removePaymentData(data?.id || '')

    const paymentData: PaymentData = {
      id,
      type: 'wise',
      email,
      beneficiary,
      iban,
      bic,
      ukSortCode,
      ukBankAccount,
    }
    addPaymentData(paymentData)
    if (onSubmit) onSubmit(paymentData)
  }

  const remove = () => {
    removePaymentData(data?.id || '')
    if (onSubmit) onSubmit()
  }

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardWillHide', () => setKeyboardOpen(false))
    Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false))
    $id?.focus()
  }, [])

  return <View style={style}>
    <View>
      <View>
        <Input
          onChange={setId}
          onSubmit={() => $email?.focus()}
          reference={(el: any) => $id = el}
          value={id}
          disabled={view === 'view'}
          label={i18n('form.paymentMethodName')}
          isValid={!isFieldInError('id')}
          autoCorrect={false}
          errorMessage={getErrorsInField('id')}
        />
      </View>
      <HorizontalLine style={tw`mt-4`} />
      <View style={tw`mt-4`}>
        <Input
          onChange={setEmail}
          onSubmit={() => $beneficiary?.focus()}
          reference={(el: any) => $email = el}
          value={email}
          required={!anyFieldSet}
          disabled={view === 'view'}
          label={i18n('form.email')}
          isValid={!isFieldInError('email')}
          autoCorrect={false}
          errorMessage={getErrorsInField('email')}
        />
      </View>
      <HorizontalLine style={tw`mt-4`} />
      <View style={tw`mt-4`}>
        <Input
          onChange={setBeneficiary}
          onSubmit={() => $iban?.focus()}
          reference={(el: any) => $beneficiary = el}
          required={!anyFieldSet}
          value={beneficiary}
          disabled={view === 'view'}
          label={i18n('form.beneficiary')}
          isValid={!isFieldInError('beneficiary')}
          autoCorrect={false}
          errorMessage={getErrorsInField('beneficiary')}
        />
      </View>
      <View style={tw`mt-4`}>
        <Input
          onChange={setIBAN}
          onSubmit={() => $bic?.focus()}
          reference={(el: any) => $iban = el}
          required={!anyFieldSet}
          value={iban}
          disabled={view === 'view'}
          label={i18n('form.iban')}
          isValid={!isFieldInError('iban')}
          autoCorrect={false}
          errorMessage={getErrorsInField('iban')}
        />
      </View>
      <View style={tw`mt-4`}>
        <Input
          onChange={setBIC}
          onSubmit={() => $bic?.focus()}
          reference={(el: any) => $bic = el}
          required={!anyFieldSet}
          value={bic}
          disabled={view === 'view'}
          label={i18n('form.bic')}
          isValid={!isFieldInError('bic')}
          autoCorrect={false}
          errorMessage={getErrorsInField('bic')}
        />
      </View>
      <View style={tw`mt-4`}>
        <Input
          onChange={setUKSortCode}
          onSubmit={() => $bic?.focus()}
          reference={(el: any) => $ukSortCode = el}
          required={!anyFieldSet}
          value={ukSortCode}
          disabled={view === 'view'}
          label={i18n('form.ukSortCode')}
          isValid={!isFieldInError('ukSortCode')}
          autoCorrect={false}
          errorMessage={getErrorsInField('ukSortCode')}
        />
      </View>
      <View style={tw`mt-2`}>
        <Input
          onChange={setUKBankAccount}
          onSubmit={save}
          reference={(el: any) => $ukBankAccount = el}
          required={!anyFieldSet}
          value={ukBankAccount}
          disabled={view === 'view'}
          label={i18n('form.ukBankAccount')}
          isValid={!isFieldInError('ukBankAccount')}
          autoCorrect={false}
          errorMessage={getErrorsInField('ukBankAccount')}
        />
      </View>
    </View>
    {view !== 'view'
      ? <Fade show={!keyboardOpen} style={tw`w-full flex items-center`}>
        <Pressable style={tw`absolute left-0 z-10`} onPress={onCancel}>
          <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-white-1`.color as string} />
        </Pressable>
        <Button
          title={i18n('form.paymentMethod.add')}
          secondary={true}
          wide={false}
          onPress={save}
        />
        {view === 'edit'
          ? <Pressable onPress={remove} style={tw`mt-6`}>
            <Text style={tw`font-baloo text-sm text-center underline text-white-1`}>
              {i18n('form.paymentMethod.remove')}
            </Text>
          </Pressable>
          : null
        }
      </Fade>
      : null
    }
  </View>
}