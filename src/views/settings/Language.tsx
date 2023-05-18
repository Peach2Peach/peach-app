import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { Flag, PeachScrollView, PrimaryButton, RadioButtons, Text } from '../../components'
import i18n from '../../utils/i18n'
import { useLanguageSetup } from './hooks/useLanguageSetup'
import { localeToFlagMap } from '../../components/flags/localeToFlagMap'

export default () => {
  const { locale, setLocale, saveLocale } = useLanguageSetup()

  return (
    <View style={tw`flex h-full`}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-grow px-10 pb-10`}>
        <RadioButtons
          style={tw`mt-2`}
          selectedValue={locale}
          items={i18n.getLocales().map((l) => ({
            value: l,
            display: (
              <View style={tw`flex-row items-center`}>
                <Flag id={localeToFlagMap[l]} style={tw`w-8 h-8 mr-4 overflow-hidden`} />
                <Text style={tw`subtitle-1`}>{i18n(`languageName.${l}`)}</Text>
              </View>
            ),
          }))}
          onChange={setLocale}
        />
      </PeachScrollView>
      <View style={tw`flex items-center w-full px-6 mt-4 bg-primary-background`}>
        <PrimaryButton testID="navigation-next" onPress={() => saveLocale(locale)} style={tw`mb-6`}>
          {i18n('confirm')}
        </PrimaryButton>
      </View>
    </View>
  )
}
