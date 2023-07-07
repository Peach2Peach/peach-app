import { PeachScrollView, RadioButtons } from '../../components'
import { CURRENCIES } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getCurrencyTypeFilter } from './utils'

type Props = {
  currency: Currency
  setCurrency: (c: Currency) => void
  type: 'europe' | 'other'
}

export const Currencies = ({ currency, setCurrency, type }: Props) => {
  const currencies = CURRENCIES.filter(getCurrencyTypeFilter(type)).map((c) => ({
    value: c,
    display: i18n(`currency.${c}`),
  }))
  return (
    <PeachScrollView contentContainerStyle={[tw`justify-center flex-grow py-4`, tw.md`py-8`]}>
      <RadioButtons style={tw`items-center`} items={currencies} selectedValue={currency} onChange={setCurrency} />
    </PeachScrollView>
  )
}
