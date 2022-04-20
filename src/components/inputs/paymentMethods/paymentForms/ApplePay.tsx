import React, { useState } from 'react'
import { Pressable, View } from 'react-native'
import { PaymentMethodForm } from '.'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import Button from '../../../Button'
import Icon from '../../../Icon'
import { Text } from '../../../text'
import Input from '../../Input'
const { useValidation } = require('react-native-form-validator')

export const ApplePay: PaymentMethodForm = ({ style, data, onSubmit, onCancel }) =>
  <View style={style}>
    <Text>TODO</Text>
  </View>