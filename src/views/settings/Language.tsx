import { PeachScrollView, RadioButtons, Screen } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useNavigation } from '../../hooks'
import { useLanguage } from '../../hooks/useLanguage'
import tw from '../../styles/tailwind'
import { sortAlphabetically } from '../../utils/array'
import i18n from '../../utils/i18n'

export const Language = () => {
  const { locale, updateLocale } = useLanguage()
  const navigation = useNavigation()

  const onConfirm = () => {
    navigation.goBack()
  }

  return (
    <Screen header={i18n('language')}>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`}>
        <RadioButtons
          selectedValue={locale || 'en'}
          items={i18n
            .getLocales()
            .map((l) => ({ value: l, display: i18n(`languageName.${l}`) }))
            .sort((a, b) => sortAlphabetically(a.display, b.display))}
          onButtonPress={updateLocale}
        />
      </PeachScrollView>
      <Button style={tw`self-center`} onPress={onConfirm}>
        {i18n('confirm')}
      </Button>
    </Screen>
  )
}
