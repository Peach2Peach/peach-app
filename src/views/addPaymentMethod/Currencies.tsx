import { PeachScrollView, RadioButtons } from '../../components'
import { CURRENCIES } from '../../paymentMethods'
import { CurrencyType } from '../../store/offerPreferenes/types'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getCurrencyTypeFilter } from './utils'

const getDisplayName = (c: Currency) => {
  if (c === 'USDT') return i18n(`currency.${c}`)
  if (c === 'SAT') return i18n('paymentMethod.lnurl')
  return i18n(`currency.${c}`)
}

type Props = {
  currency: Currency
  setCurrency: (c: Currency) => void
  type: CurrencyType
}

export const Currencies = ({ currency, setCurrency, type }: Props) => {
  const currencies = CURRENCIES.filter(getCurrencyTypeFilter(type)).map((c) => ({
    value: c,
    display: getDisplayName(c),
  }))
  return (
    <PeachScrollView contentContainerStyle={[tw`justify-center grow py-sm`, tw`md:py-md`]}>
      <RadioButtons items={currencies} selectedValue={currency} onButtonPress={setCurrency} />
    </PeachScrollView>
  )
}
