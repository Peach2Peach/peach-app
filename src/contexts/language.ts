import { createContext } from 'react'

/**
 * @description Context for localization
 * @example
 * import LanguageContext from './contexts/language'
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