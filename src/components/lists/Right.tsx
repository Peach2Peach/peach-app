import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { priceFormat } from '../../utils/string'
import { BTCAmount } from '../bitcoin'
import { Text } from '../text'
import { FixedHeightText } from './FixedHeightText'

type Props = {
  amount?: number | [number, number]
  price?: number
  currency?: Currency
}

type Empty = {
  type: 'empty'
} & Partial<Props>

type FiatAmount = {
  type: 'fiatAmount'
  amount: number
} & Required<Props>

type Range = {
  type: 'range'
  amount: [number, number]
} & Partial<Props>

type Amount = {
  type: 'amount'
  amount: number
} & Partial<Props>

const isFiatAmount = (props: Props): props is FiatAmount =>
  typeof props.amount === 'number' && props.price !== undefined && props.currency !== undefined
const isRange = (props: Props): props is Range => Array.isArray(props.amount)
const isAmount = (props: Props): props is Amount => typeof props.amount === 'number'

const getType = (props: Props): Empty | FiatAmount | Range | Amount => {
  if (isRange(props)) return { ...props, type: 'range' }
  if (isFiatAmount(props)) return { ...props, type: 'fiatAmount' }
  if (isAmount(props)) return { ...props, type: 'amount' }
  return { ...props, type: 'empty' }
}

export const Right = (propsWithoutType: Props) => {
  const { type, amount, price, currency } = getType(propsWithoutType)
  return (
    <View
      style={[
        tw`items-end pt-4px pb-1px w-141px h-40px`,
        type === 'fiatAmount' && tw` gap-6px`,
        type === 'empty' && tw`w-px`,
      ]}
    >
      {type === 'range' ? (
        <View style={tw`items-center -gap-1`}>
          <BTCAmount size="small" amount={amount[0]} />
          <Text style={tw`font-baloo-medium text-12px leading-19px text-black-3`}>~</Text>
          <BTCAmount size="small" amount={amount[1]} />
        </View>
      ) : type === 'fiatAmount' ? (
        <>
          <BTCAmount size="small" amount={amount} />
          <FixedHeightText style={tw`body-m text-black-2`} height={17}>
            {priceFormat(price)} {currency}
          </FixedHeightText>
        </>
      ) : (
        type === 'amount' && <BTCAmount amount={amount} size="small" />
      )}
    </View>
  )
}
