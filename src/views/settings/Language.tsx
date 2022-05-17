import React, { ReactElement, useContext, useReducer, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import { Button, Title } from '../../components'
import i18n from '../../utils/i18n'


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contact'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [{ locale }, setLocale] = useReducer(i18n.setLocale, { locale: i18n.getLocale() })

  return <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
    <Title title={i18n('settings.title')} subtitle={i18n('settings.language.subtitle')} />
    <View style={tw`h-full flex-shrink mt-12`}>
      {i18n.getLocales().map(lcl => <Button
        key={lcl}
        title={i18n(`languageName.${lcl}`)}
        style={tw`mb-3`}
        onPress={() => setLocale({ locale: lcl })}
        wide={true}
        grey={true}
      />)}
    </View>
    <View style={tw`flex items-center mt-16`}>
      <Button
        title={i18n('back')}
        wide={false}
        secondary={true}
        onPress={navigation.goBack}
      />
    </View>
  </View>
}

