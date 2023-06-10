import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Text } from '../../../components'
import { NumberInput } from '../../../components/inputs'
import { useOfferPreferences } from '../../../store/offerPreferenes/useOfferPreferences'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { enforcePremiumFormat } from '../helpers/enforcePremiumFormat'

export const PremiumInput = ({ style }: ComponentProps) => {
  const [premium, setPremium] = useOfferPreferences((state) => [state.premium, state.setPremium], shallow)

  const textColor = premium === 0 ? tw`text-black-1` : premium > 0 ? tw`text-success-main` : tw`text-primary-main`

  return (
    <View style={[tw`flex-row items-center justify-center`, style]}>
      <Text style={[tw`leading-2xl`, textColor]}>{i18n(premium >= 0 ? 'sell.premium' : 'sell.discount')}:</Text>
      <View style={tw`h-10 ml-2`}>
        <NumberInput
          style={tw`w-24`}
          inputStyle={tw`text-right`}
          value={enforcePremiumFormat(premium) || '0'}
          onChange={setPremium}
          icons={[['percent', () => {}]]}
        />
      </View>
    </View>
  )
}
