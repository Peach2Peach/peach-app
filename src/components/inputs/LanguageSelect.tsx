import React, { createContext, ReactElement, useContext, useReducer, useState } from 'react'
import { View } from 'react-native'
import { Text } from '..'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import Select from './Select'

/**
 * @description Context for localization
 * @example
 * import LanguageContext from './components/inputs/LanguageSelect'
 *
 * export default (): ReactElement =>
 *   const { locale } = useContext(LanguageContext)
 *   return <Text>
 *     {locale}
 *   </Text>
 * }
 */
export const LanguageContext = createContext({ locale: 'en' })


export default LanguageContext


/**
 * @description Component to display the language select
 * @param props Component properties
 * @param props.locale the current locale
 * @param props.setLocale method to set locale on value change
 */
export const LanguageSelect = (): ReactElement => {
  const languages = i18n.getLocales().map(lcl => ({
    value: lcl,
    display: i18n(`languageName.${lcl}`)
  }))
  useContext(LanguageContext)
  const [{ locale }, setLocale] = useReducer(i18n.setLocale, { locale: 'en' })
  const [pristine, setPristine] = useState(true)

  return <View style={tw`w-40`}>
    <Select
      items={languages}
      placeholder={i18n('language')}
      selectedValue={pristine ? null : locale}
      onChange={value => {
        setLocale({ locale: value as string })
        setPristine(false)
      }}
    />
  </View>
}