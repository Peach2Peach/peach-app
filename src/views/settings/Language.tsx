import { View } from 'react-native'
import { PeachScrollView, PrimaryButton, RadioButtons, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useLanguageSetup } from './hooks/useLanguageSetup'

export const Language = () => {
  const { locale, setLocale, saveLocale } = useLanguageSetup()

  return (
    <View style={tw`flex h-full`}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-grow px-10 pb-10`}>
        <RadioButtons
          selectedValue={locale}
          items={i18n.getLocales().map((l) => ({
            value: l,
            display: <Text style={tw`subtitle-1`}>{i18n(`languageName.${l}`)}</Text>,
          }))}
          onChange={setLocale}
        />
      </PeachScrollView>
      <View style={tw`flex items-center w-full px-6 mt-4 mb-5 bg-primary-background`}>
        <PrimaryButton testID="navigation-next" narrow onPress={() => saveLocale(locale)}>
          {i18n('confirm')}
        </PrimaryButton>
      </View>
    </View>
  )
}
