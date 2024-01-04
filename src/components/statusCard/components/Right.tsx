import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { groupChars } from '../../../utils/string/groupChars'
import { priceFormat } from '../../../utils/string/priceFormat'
import { BTCAmount } from '../../bitcoin/btcAmount/BTCAmount'
import { FixedHeightText } from '../../text/FixedHeightText'
import { PeachText } from '../../text/PeachText'
import { StatusCardProps } from '../StatusCard'

export type Props = Pick<StatusCardProps, 'amount' | 'price' | 'currency' | 'replaced' | 'premium'>

export function Right (propsWithoutType: Props) {
  const { type, amount, price, currency, premium } = getPropsWithType(propsWithoutType)
  return (
    <View
      style={[
        tw`items-end pt-4px pb-1px w-141px h-40px`,
        ['amount', 'fiatAmount'].includes(type) && tw`gap-6px`,
        type === 'empty' && tw`w-px`,
      ]}
    >
      {type === 'range' ? (
        <View style={tw`items-center -gap-1`}>
          <BTCAmount size="small" amount={amount[0]} />
          <PeachText style={tw`font-baloo-medium text-12px leading-19px text-black-50`}>~</PeachText>
          <BTCAmount size="small" amount={amount[1]} />
        </View>
      ) : type === 'fiatAmount' ? (
        <>
          <BTCAmount size="small" amount={amount} />
          <FixedHeightText style={tw`body-m text-black-65`} height={17}>
            {currency === 'SAT' ? groupChars(String(price), 3) : priceFormat(price)} {currency}
          </FixedHeightText>
        </>
      ) : (
        type === 'amount' && (
          <>
            <BTCAmount size="small" amount={amount} />
            {premium !== undefined && (
              <FixedHeightText style={tw`body-m text-black-65`} height={17}>
                {premium}% {i18n('offer.summary.premium')}
              </FixedHeightText>
            )}
          </>
        )
      )}
    </View>
  )
}

type Empty = {
  type: 'empty'
} & Partial<Props>

type Amount = {
  type: 'amount'
  amount: number
} & Partial<Props>
const isAmount = (props: Props): props is Omit<Amount, 'type'> => typeof props.amount === 'number'

type FiatAmount = {
  type: 'fiatAmount'
  amount: number
} & Required<Props>
const isFiatAmount = (props: Props): props is Omit<FiatAmount, 'type'> =>
  typeof props.amount === 'number' && props.price !== undefined && props.currency !== undefined

type Range = {
  type: 'range'
  amount: [number, number]
} & Partial<Props>

const isRange = (props: Props): props is Omit<Range, 'type'> => Array.isArray(props.amount)

function getPropsWithType (props: Props): Empty | FiatAmount | Range | Amount {
  if (props.replaced) return { ...props, type: 'empty' }
  if (isRange(props)) return { ...props, type: 'range' }
  if (isFiatAmount(props)) return { ...props, type: 'fiatAmount' }
  if (isAmount(props)) return { ...props, type: 'amount' }
  return { ...props, type: 'empty' }
}
