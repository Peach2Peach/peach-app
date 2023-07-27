import { PeachScrollView, PrimaryButton, RadioButtons, Screen } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useLanguageSetup } from './hooks/useLanguageSetup'

export const Language = () => {
  const { locale, setLocale, saveLocale } = useLanguageSetup()

  return (
    <Screen>
      <PeachScrollView contentContainerStyle={tw`justify-center flex-grow`}>
        <RadioButtons
          selectedValue={locale}
          items={i18n.getLocales().map((l) => ({
            value: l,
            display: i18n(`languageName.${l}`),
          }))}
          onButtonPress={setLocale}
        />
      </PeachScrollView>
      <PrimaryButton style={tw`self-center mb-5`} narrow onPress={() => saveLocale(locale)}>
        {i18n('confirm')}
      </PrimaryButton>
    </Screen>
  )
}
