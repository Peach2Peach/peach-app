import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { PrimaryButton, PrimaryButtonProps } from './PrimaryButton'
import i18n from '../../utils/i18n'

export const GoBackButton = (props: PrimaryButtonProps) => {
  const navigation = useNavigation()
  return (
    <PrimaryButton onPress={navigation.goBack} {...props} narrow>
      {i18n('back')}
    </PrimaryButton>
  )
}
