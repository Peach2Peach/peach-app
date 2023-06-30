import tw from '../../styles/tailwind'
import { PeachScrollView, RadioButtons } from '../../components'
import { CURRENCIES } from '../../constants'
import i18n from '../../utils/i18n'

type Props = {
  currency?: Currency
  setCurrency: (c: Currency) => void
}

export const Other = ({ currency = 'EUR', setCurrency }: Props) => {
  const currencies = CURRENCIES.filter((c) => c === 'L-USDT').map((c) => ({
    value: c,
    display: i18n(`currency.${c}`),
  }))
  return (
    <PeachScrollView contentStyle={[tw`h-full p-4`, tw.md`p-8`]} contentContainerStyle={tw`flex-grow`}>
      <RadioButtons
        style={tw`items-center justify-center`}
        items={currencies}
        selectedValue={currency}
        onChange={setCurrency}
      />
    </PeachScrollView>
  )
}
