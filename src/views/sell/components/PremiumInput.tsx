import { useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon, Text } from '../../../components'
import { PercentageInput } from '../../../components/inputs'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { round } from '../../../utils/math'
import { enforcePremiumFormat } from '../helpers/enforcePremiumFormat'

const convertDisplayPremiumToNumber = (displayPremium: string) => {
  const asNumberType = Number(enforcePremiumFormat(displayPremium))
  if (isNaN(asNumberType)) return 0
  return asNumberType
}

type Props = {
  premium: number
  setPremium: (newPremium: number) => void
  incrementBy?: number
}

export const PremiumInput = ({ premium, setPremium, incrementBy = 0.1 }: Props) => {
  const [displayPremium, setDisplayPremium] = useState(premium.toString())

  const displayValue = useMemo(() => {
    const displayPremiumAsNumber = convertDisplayPremiumToNumber(displayPremium)
    if (premium === displayPremiumAsNumber) return displayPremium
    return premium.toString()
  }, [premium, displayPremium])

  const changePremium = (value: string) => {
    const newPremium = enforcePremiumFormat(value)
    setDisplayPremium(newPremium)
    setPremium(convertDisplayPremiumToNumber(newPremium))
  }

  const onMinusPress = () => {
    const newPremium = round(Math.max(premium - incrementBy, -21), 2)
    setPremium(newPremium)
    setDisplayPremium(newPremium.toString())
  }

  const onPlusPress = () => {
    const newPremium = round(Math.min(premium + incrementBy, 21), 2)
    setPremium(newPremium)
    setDisplayPremium(newPremium.toString())
  }

  const textColor = premium === 0 ? tw`text-black-1` : premium > 0 ? tw`text-success-main` : tw`text-primary-main`

  return (
    <View style={tw`flex-row items-center justify-between`}>
      <TouchableOpacity onPress={onMinusPress} accessibilityHint={i18n('number.decrease')}>
        <Icon id="minusCircle" size={24} color={tw.color('primary-main')} />
      </TouchableOpacity>
      <View style={tw`flex-row items-center justify-center gap-2 grow`}>
        <Text style={[tw`text-center body-l`, textColor]}>{i18n(premium >= 0 ? 'sell.premium' : 'sell.discount')}:</Text>
        <PercentageInput value={displayValue} onChange={changePremium} />
      </View>
      <TouchableOpacity onPress={onPlusPress} accessibilityHint={i18n('number.increase')}>
        <Icon id="plusCircle" size={24} color={tw.color('primary-main')} />
      </TouchableOpacity>
    </View>
  )
}
