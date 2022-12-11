import React, { ReactElement } from 'react'
import { Pressable, Text } from 'react-native'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const ContactButton = ({ style }: ComponentProps): ReactElement => {
  const navigation = useNavigation()
  const goToContactUs = () => navigation.navigate('reportFullScreen')
  return (
    <Pressable style={style} onPress={goToContactUs}>
      <Text style={tw`underline text-xs text-black-1`}>{i18n('newUser.contact').toLocaleUpperCase()}</Text>
    </Pressable>
  )
}
