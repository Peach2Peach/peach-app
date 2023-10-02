import { NewHeader as Header, PeachScrollView, PrimaryButton, RadioButtons, Screen } from '../../components'
import { useNavigation } from '../../hooks'
import { useLanguage } from '../../hooks/useLanguage'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const Language = () => {
  const { locale, setLocale, saveLocale } = useLanguage()
  const navigation = useNavigation()

  const onConfirm = () => {
    saveLocale(locale)
    navigation.goBack()
  }

  return (
    <Screen>
      <Header title={i18n('language')} />
      <PeachScrollView contentContainerStyle={tw`justify-center grow`}>
        <RadioButtons
          selectedValue={locale}
          items={i18n.getLocales().map((l) => ({
            value: l,
            display: i18n(`languageName.${l}`),
          }))}
          onButtonPress={setLocale}
        />
      </PeachScrollView>
      <PrimaryButton style={tw`self-center mb-5`} narrow onPress={onConfirm}>
        {i18n('confirm')}
      </PrimaryButton>
    </Screen>
  )
}
