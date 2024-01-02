import { View } from 'react-native'
import { premiumBounds } from '../../../components/PremiumInput'
import { PremiumTextInput } from '../../../components/PremiumTextInput'
import { TouchableIcon } from '../../../components/TouchableIcon'
import { Checkbox } from '../../../components/inputs/Checkbox'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
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
      <Checkbox green checked={shouldApplyFilter} onPress={onCheckboxPress}>
        {i18n('offerPreferences.filters.maxPremium')}
      </Checkbox>
      <View style={tw`flex-row items-center gap-10px`}>
        <TouchableIcon id="minusCircle" iconColor={iconColor} onPress={onMinusCirclePress} />
        <PremiumTextInput premium={maxPremium || defaultMaxPremium} setPremium={setMaxPremium} />
        <TouchableIcon id="plusCircle" iconColor={iconColor} onPress={onPlusCirclePress} />
      </View>
    </View>
  )
}
