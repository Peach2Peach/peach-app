import { View } from 'react-native'
import { Checkbox, TouchableIcon } from '../../../components'
import { premiumBounds } from '../../../components/PremiumInput'
import { PremiumTextInput } from '../../../components/PremiumTextInput'
import tw from '../../../styles/tailwind'
import { round } from '../../../utils/math/round'

const defaultMaxPremium = 0
type Props = {
  maxPremium: number | null
  setMaxPremium: (newMaxPremium: number) => void
  shouldApplyFilter: boolean
  toggleShouldApplyFilter: () => void
}
export function MaxPremiumFilterComponent ({
  maxPremium,
  setMaxPremium,
  shouldApplyFilter,
  toggleShouldApplyFilter,
}: Props) {
  const onCheckboxPress = () => {
    toggleShouldApplyFilter()
    if (maxPremium === null) {
      setMaxPremium(defaultMaxPremium)
    }
  }
  const onPlusCirclePress = () => {
    setMaxPremium(Math.min(round((maxPremium || defaultMaxPremium) + 1, 2), premiumBounds.max))
  }

  const onMinusCirclePress = () => {
    setMaxPremium(Math.max(round((maxPremium || defaultMaxPremium) - 1, 2), premiumBounds.min))
  }

  const iconColor = tw.color('success-main')

  return (
    <View style={tw`flex-row items-center self-stretch justify-between`}>
      <Checkbox green checked={shouldApplyFilter} onPress={onCheckboxPress} text="max premium" />
      <View style={tw`flex-row items-center gap-10px`}>
        <TouchableIcon id="minusCircle" iconColor={iconColor} onPress={onMinusCirclePress} />
        <PremiumTextInput premium={maxPremium || defaultMaxPremium} setPremium={setMaxPremium} />
        <TouchableIcon id="plusCircle" iconColor={iconColor} onPress={onPlusCirclePress} />
      </View>
    </View>
  )
}
