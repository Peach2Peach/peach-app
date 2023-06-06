import { SatsFormat } from '../components'
import tw from '../styles/tailwind'

export const TradeBreakdownSats = ({ amount }: { amount: number }) => (
  <SatsFormat
    containerStyle={tw`items-start justify-between h-5 w-45`}
    bitcoinLogoStyle={tw`w-[18px] h-[18px] mr-2`}
    style={tw`font-normal leading-tight body-l`}
    satsStyle={tw`font-normal body-s`}
    sats={amount}
  />
)
