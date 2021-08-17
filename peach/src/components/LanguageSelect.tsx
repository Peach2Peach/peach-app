import React, { createContext, ReactElement } from 'react'
import { Text, View } from 'react-native'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import Select from './Select'

/**
 * @description Context for localization
 * @example
 * import LanguageContext from './components/LanguageSelect'
 *
 * export default (): ReactElement =>
 *   const { locale } = useContext(LanguageContext)
 *   return <Text>
 *     {locale}
 *   </Text>
 * }
 */
const LanguageContext = createContext({ locale: 'en' })


export default LanguageContext

interface LanguageSelectProps {
  locale: string,
  setLocale: Function
}

/**
 * @description Component to display the language select
 * @param {Object} props Component properties
 * @param {string} props.locale the current locale
 * @param {Function} props.setLocale method to set locale on value change
 * @returns {ReactElement}
 */
export const LanguageSelect = ({ locale, setLocale }: LanguageSelectProps): ReactElement => {
  const languages = [
    {
      value: 'en',
      text: i18n('language.en')
    },
    {
      value: 'de',
      text: i18n('language.de')
    }
  ]
  return <View>
    <View style={tw`mt-4 w-40`}>
      <Text>{i18n('language')}</Text>
      <Select
        items={languages}
        selectedValue={locale}
        onChange={e => setLocale({ locale: e.currentTarget.value })}
      />
    </View>
  </View>
}