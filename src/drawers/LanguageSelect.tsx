import { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { HorizontalLine, Icon, Text } from '../components'
import tw from '../styles/tailwind'
import { sortAlphabetically } from '../utils/array/sortAlphabetically'
import i18n from '../utils/i18n'

type Props = {
  locales: string[]
  selected?: string
  onSelect: (country: string) => void
}
export const LanguageSelect = ({ locales, selected, onSelect }: Props): ReactElement => (
  <View>
    {locales
      .sort((a, b) => sortAlphabetically(i18n(`languageName.${a}`), i18n(`languageName.${b}`)))
      .map((locale) => (
        <Pressable key={locale} onPress={() => onSelect(locale)}>
          <View style={tw`flex flex-row items-center px-8`}>
            <Text style={tw`flex-shrink w-full subtitle-1`}>{i18n(`languageName.${locale}`)}</Text>
            {locale === selected && <Icon id="check" style={tw`w-6 h-6`} color={tw`text-primary-main`.color} />}
          </View>
          <HorizontalLine style={tw`my-6`} />
        </Pressable>
      ))}
  </View>
)
