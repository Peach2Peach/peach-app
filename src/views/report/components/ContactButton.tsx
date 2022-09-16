import React, { ReactElement } from 'react'
import { Pressable, Text } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { StackNavigation } from '../../../utils/navigation'

type ContactButtonProps = ComponentProps & {
    navigation: StackNavigation
}

export const ContactButton = ({ navigation, style }: ContactButtonProps): ReactElement => {
  const goToContactUs = () => navigation.navigate('reportFullScreen', {})
  return <Pressable
    style={style}
    onPress={goToContactUs}>
    <Text style={tw`underline text-xs text-black-1`}>
      {i18n('newUser.contact').toLocaleUpperCase()}
    </Text>
  </Pressable>
}