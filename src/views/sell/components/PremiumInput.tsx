import { useMemo, useState } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Text } from '../../../components'
import { PercentageInput } from '../../../components/inputs'
import { useOfferPreferences } from '../../../store/offerPreferenes/useOfferPreferences'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { enforcePremiumFormat } from '../helpers/enforcePremiumFormat'

const convertDisplayPremiumToNumber = (displayPremium: string) => {
  const asNumberType = Number(enforcePremiumFormat(displayPremium))
  if (isNaN(asNumberType)) return 0
  return asNumberType
}

export const PremiumInput = ({ style }: ComponentProps) => {
  const [premium, setPremium] = useOfferPreferences((state) => [state.premium, state.setPremium], shallow)
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

  const textColor = premium === 0 ? tw`text-black-1` : premium > 0 ? tw`text-success-main` : tw`text-primary-main`

  return (
    <View style={[tw`flex-row items-center justify-center`, style]}>
      <Text style={[tw`leading-2xl`, textColor]}>{i18n(premium >= 0 ? 'sell.premium' : 'sell.discount')}:</Text>
      <View style={tw`h-10 ml-2`}>
        <PercentageInput value={displayValue} onChange={changePremium} />
      </View>
    </View>
  )
}
