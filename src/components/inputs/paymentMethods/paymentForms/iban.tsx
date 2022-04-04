import React, { useRef, useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { PaymentMethodForm } from '.'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import Button from '../../../Button'
import Icon from '../../../Icon'
import Input from '../../Input'
const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function
export const IBAN: PaymentMethodForm = ({ style, data, onSubmit, onCancel }) => {
  const [iban, setIBAN] = useState(data?.iban || '')
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const $iban = useRef<TextInput>(null)

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { iban, beneficiary },
    rules,
    messages: getMessages()
  })

  const save = () => {
    validate({
      iban: {
        required: true,
        iban: true
      },
      beneficiary: {
        required: true,
      }
    })
    if (!isFormValid()) return
    if (onSubmit) onSubmit({
      id: `iban-${iban.replace(/\s/gu, '')}-${new Date().getTime()}`,
      type: 'iban',
      iban,
      beneficiary,
    })
  }

  return <View style={style}>
    <View style={[tw`mt-32`, tw.md`mt-40`]}>
      <View>
        <Input
          onChange={setBeneficiary}
          onSubmit={() => $iban.current?.focus()}
          value={beneficiary}
          disabled={!!data}
          label={i18n('form.beneficiary')}
          isValid={!isFieldInError('beneficiary')}
          autoCorrect={false}
          errorMessage={getErrorsInField('beneficiary')}
        />
      </View>
      <View style={tw`mt-2`}>
        <Input
          onChange={setIBAN}
          onSubmit={save}
          reference={$iban}
          value={iban}
          disabled={!!data}
          label={i18n('form.iban')}
          isValid={!isFieldInError('iban')}
          autoCorrect={false}
          errorMessage={getErrorsInField('iban')}
        />
      </View>
    </View>
    {!data
      ? <View style={tw`w-full flex items-center`}>
        <Pressable style={tw`absolute left-0 z-10`} onPress={onCancel}>
          <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-white-1`.color as string} />
        </Pressable>
        <Button
          title={i18n('form.paymentMethod.add')}
          secondary={true}
          wide={false}
          onPress={save}
        />
      </View>
      : null
    }
  </View>
}