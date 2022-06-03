import React, { useEffect, useRef, useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { PaymentMethodForm } from '.'
import keyboard from '../../../../effects/keyboard'
import tw from '../../../../styles/tailwind'
import { addPaymentData, getPaymentData, removePaymentData } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import { Fade } from '../../../animation'
import Button from '../../../Button'
import Icon from '../../../Icon'
import { Text } from '../../../text'
import Input from '../../Input'
const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function
export const Tether: PaymentMethodForm = ({ style, data, view, onSubmit, onCancel }) => {
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [id, setId] = useState(data?.id || '')
  const [tetherAddress, setTetherAddress] = useState(data?.tetherAddress || '')
  let $id = useRef<TextInput>(null).current
  let $tetherAddress = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { id, tetherAddress },
    rules,
    messages: getMessages()
  })

  const save = () => {
    validate({
      id: {
        required: true,
        duplicate: view === 'new' && getPaymentData(id)
      },
      tetherAddress: {
        required: true,
        tetherAddress: true,
      }
    })
    if (!isFormValid()) return

    const paymentData: PaymentData & TetherData = {
      id,
      type: 'tether',
      tetherAddress,
    }
    addPaymentData(paymentData)
    if (onSubmit) onSubmit(paymentData)
  }

  const remove = () => {
    removePaymentData(data?.id || '')
    if (onSubmit) onSubmit()
  }

  useEffect(keyboard(setKeyboardOpen), [])

  return <View style={[tw`flex`, style]}>
    <View style={tw`h-full flex-shrink flex justify-center`}>
      <View>
        <Input
          onChange={setId}
          onSubmit={() => $tetherAddress?.focus()}
          reference={(el: any) => $id = el}
          value={id}
          disabled={view === 'view'}
          label={i18n('form.paymentMethodName')}
          isValid={!isFieldInError('id')}
          autoCorrect={false}
          errorMessage={getErrorsInField('id')}
        />
      </View>
      <View style={tw`mt-2`}>
        <Input
          onChange={setTetherAddress}
          onSubmit={save}
          reference={(el: any) => $tetherAddress = el}
          value={tetherAddress}
          disabled={view === 'view'}
          label={i18n('form.tetherAddress.tether')}
          isValid={!isFieldInError('tetherAddress')}
          autoCorrect={false}
          errorMessage={getErrorsInField('tetherAddress')}
        />
      </View>
    </View>
    {view !== 'view'
      ? <Fade show={!keyboardOpen} style={tw`w-full flex items-center`}>
        <Pressable style={tw`absolute left-0 z-10`} onPress={onCancel}>
          <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-white-1`.color as string} />
        </Pressable>
        <Button
          title={i18n(view === 'new' ? 'form.paymentMethod.add' : 'form.paymentMethod.update')}
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