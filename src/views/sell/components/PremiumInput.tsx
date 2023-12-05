import { useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from '../../../components'
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
}

export const PremiumInput = ({ premium, setPremium }: Props) => {
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
    const newPremium = round(Math.max(premium - 1, -21), 2)
    setPremium(newPremium)
    setDisplayPremium(newPremium.toString())
  }

  const onPlusPress = () => {
    const newPremium = round(Math.min(premium + 1, 21), 2)
    setPremium(newPremium)
    setDisplayPremium(newPremium.toString())
  }

  return (
    <View style={tw`flex-row items-center justify-center gap-10px`}>
      <TouchableOpacity onPress={onMinusPress} accessibilityHint={i18n('number.decrease')}>
        <Icon id="minusCircle" size={24} color={tw.color('primary-main')} />
      </TouchableOpacity>
      <View style={tw`flex-row items-center justify-center gap-2`}>
        <PercentageInput value={displayValue} onChange={changePremium} />
      </View>
      <TouchableOpacity onPress={onPlusPress} accessibilityHint={i18n('number.increase')}>
        <Icon id="plusCircle" size={24} color={tw.color('primary-main')} />
      </TouchableOpacity>
    </View>
  )
}
