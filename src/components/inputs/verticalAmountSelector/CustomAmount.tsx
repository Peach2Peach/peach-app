import { View } from 'react-native'
import { PriceFormat, SatsFormat } from '../../text'
import Input from '../Input'
import tw from '../../../styles/tailwind'
import { round } from '../../../utils/math'
import { SATSINBTC } from '../../../constants'

type Props = ComponentProps & {
  amount: number
  setAmount: (amount: number) => void
  fiatPrice: number
  setCustomFiatPrice: (price: number) => void
  bitcoinPrice: number
  displayCurrency: Currency
  disable?: boolean
}

export const CustomAmount = ({
  amount,
  setAmount,
  fiatPrice,
  setCustomFiatPrice,
  bitcoinPrice,
  displayCurrency,
  disable,
  style,
}: Props) => {
  const clearCustomAmount = () => {
    setAmount(0)
    setCustomFiatPrice(0)
  }
  const updateCustomAmount = (val: string) => {
    const num = Number(val)
    if (isNaN(num)) {
      setAmount(0)
    } else {
      setAmount(num)
    }
  }
  const updateCustomFiatAmount = (val: string) => {
    const num = Number(val)
    let newAmount = amount
    if (isNaN(num)) {
      setCustomFiatPrice(0)
    } else {
      newAmount = round((num / bitcoinPrice) * SATSINBTC)
      setAmount(newAmount)
      setCustomFiatPrice(num)
    }
  }
  return (
    <View style={[tw`gap-2`, style]}>
      <View style={tw`h-8`}>
        <View
          style={[tw`px-3 h-8 justify-center border rounded-full border-black-4 w-[210px]`, !disable && tw`absolute`]}
        >
          <SatsFormat sats={amount} style={tw`text-lg`} satsStyle={tw`font-bold`} />
        </View>
        {!disable && (
          <Input
            style={[tw`w-full h-8 p-0 text-xl `, { opacity: 0 }]}
            keyboardType="number-pad"
            value={amount.toString()}
            onChange={updateCustomAmount}
            onFocus={clearCustomAmount}
          />
        )}
      </View>
      <View>
        <View style={[tw`pl-3 pr-4 h-8 justify-center border rounded-full border-black-4`, !disable && tw`absolute`]}>
          <PriceFormat
            amount={fiatPrice}
            currency={displayCurrency}
            style={tw`font-courier-prime text-lg text-black-1`}
          />
        </View>
        {!disable && (
          <Input
            style={[tw`w-full h-8 p-0 text-xl `, { opacity: 0 }]}
            keyboardType="number-pad"
            value={fiatPrice.toString()}
            onChange={updateCustomFiatAmount}
            onFocus={clearCustomAmount}
          />
        )}
      </View>
    </View>
  )
}
