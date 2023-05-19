import { View } from 'react-native'
import { Input, Text } from '../../../components'
import i18n from '../../../utils/i18n'
import tw from '../../../styles/tailwind'
import { NumberInput } from '../../../components/inputs'

type Props = ComponentProps & {
  premium: string
  setPremium: (premium: string) => void
}
export const PremiumInput = ({ premium, setPremium, style }: Props) => {
  const value = Number(premium)
  const textColor = value === 0 ? tw`text-black-1` : value > 0 ? tw`text-success-main` : tw`text-primary-main`
  return (
    <View style={[tw`flex-row items-center justify-center`, style]}>
      <Text style={[tw`leading-2xl`, textColor]}>{i18n(value >= 0 ? 'sell.premium' : 'sell.discount')}:</Text>
      <View style={tw`h-10 ml-2`}>
        <NumberInput
          style={tw`w-24`}
          inputStyle={tw`text-right`}
          value={premium || '0'}
          onChange={setPremium}
          icons={[['percent', () => {}]]}
        />
      </View>
    </View>
  )
}
