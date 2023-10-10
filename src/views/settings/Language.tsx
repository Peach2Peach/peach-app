import { PeachScrollView, RadioButtons, Screen } from '../../components'
import { Button } from '../../components/buttons/Button'
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
    <Screen header={i18n('language')}>
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
      <Button style={tw`self-center`} onPress={onConfirm}>
        {i18n('confirm')}
      </Button>
    </Screen>
  )
}
