import { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { PeachScrollView, PrimaryButton, RadioButtons } from '../../components'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
import { useLanguageSetup } from './hooks/useLanguageSetup'
const { LinearGradient } = require('react-native-gradients')

export default (): ReactElement => {
  const { locale, setLocale, saveLocale } = useLanguageSetup()

  return (
    <View style={tw`flex h-full`}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-grow px-10 pb-10`}>
        <RadioButtons
          style={tw`mt-2`}
          selectedValue={locale}
          items={i18n.getLocales().map((l) => ({ value: l, display: i18n(`languageName.${l}`) }))}
          onChange={setLocale}
        />
      </PeachScrollView>
      <View style={tw`flex items-center w-full px-6 mt-4 bg-primary-background`}>
        <View style={tw`w-full h-8 -mt-8`}>
          <LinearGradient colorList={whiteGradient} angle={90} />
        </View>
        <PrimaryButton testID="navigation-next" onPress={() => saveLocale(locale)} style={tw`mb-6`}>
          {i18n('confirm')}
        </PrimaryButton>
      </View>
    </View>
  )
}
