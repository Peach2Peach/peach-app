import React, { ReactElement } from 'react'
import { Pressable, Text } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { StackNavigation } from '../../../utils/navigation'

type ContactButtonProps = ComponentProps & {
    navigation: StackNavigation
}

export const ContactButton = ({ navigation }: ContactButtonProps): ReactElement => {
  const goToContactUs = () => navigation.navigate('reportFullScreen', {})
  return <Pressable
    style={tw`p-4 absolute top-0 left-0`}
    onPress={goToContactUs}>
    <Text style={tw`underline text-xs text-black-1`}>
      {i18n('newUser.contact').toLocaleUpperCase()}
    </Text>
  </Pressable>
}