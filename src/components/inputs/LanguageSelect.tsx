import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import LanguageContext from '../../contexts/language'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import Select from './Select'

interface LanguageSelectProps {
  locale: string,
  setLocale: Function
}

/**
 * @description Component to display the language select
 * @param props Component properties
 * @param props.locale the current locale
 * @param props.setLocale method to set locale on value change
 */
export const LanguageSelect = ({ locale, setLocale }: LanguageSelectProps): ReactElement => {
  useContext(LanguageContext)
  const languages = i18n.getLocales().map(lcl => ({
    value: lcl,
    display: i18n(`languageName.${lcl}`)
  }))
  const [pristine, setPristine] = useState(true)

  return <View style={tw`w-40`}>
    <Select
      items={languages}
      label={i18n('language')}
      selectedValue={pristine ? null : locale}
      onChange={value => {
        setLocale({ locale: value as string })
        setPristine(false)
      }}
    />
  </View>
}