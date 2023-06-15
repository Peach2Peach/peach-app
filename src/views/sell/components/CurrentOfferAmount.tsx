import { SatsFormat } from '../../../components'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import tw from '../../../styles/tailwind'

export const CurrentOfferAmount = () => {
  const amount = useOfferPreferences((state) => state.sellAmount)

  return (
    <SatsFormat
      sats={amount}
      bitcoinLogoStyle={tw`w-3 h-3 mr-1`}
      style={tw`subtitle-1`}
      satsStyle={tw`font-normal body-s`}
    />
  )
}
