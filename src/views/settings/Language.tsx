import React, { ReactElement, useContext, useReducer } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { GoBackButton, PrimaryButton, Title } from '../../components'
import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'
import { updateSettings } from '../../utils/account'

export default (): ReactElement => {
  useContext(LanguageContext)
  const [{ locale }, setLocale] = useReducer(i18n.setLocale, { locale: i18n.getLocale() })

  return (
    <View style={tw`flex items-stretch h-full px-6 pt-6 pb-10`}>
      <Title title={i18n('settings.title')} subtitle={i18n('settings.language.subtitle')} />
      <View style={tw`flex-shrink h-full mt-12`}>
        {i18n.getLocales().map((lcl) => (
          <PrimaryButton
            key={lcl}
            style={tw`mb-3`}
            onPress={() => {
              setLocale({ locale: lcl })
              updateSettings({ locale }, true)
            }}
            wide
          >
            {i18n(`languageName.${lcl}`)}
          </PrimaryButton>
        ))}
      </View>
      <GoBackButton style={tw`self-center mt-16`} />
    </View>
  )
}
