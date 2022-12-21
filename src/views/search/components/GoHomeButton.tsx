import React from 'react'
import { PrimaryButton } from '../../../components'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const GoHomeButton = () => {
  const navigation = useNavigation()
  const goHome = () => navigation.navigate('home')
  return (
    <PrimaryButton style={tw`self-center mt-6`} narrow onPress={goHome}>
      {i18n('goBackHome')}
    </PrimaryButton>
  )
}
