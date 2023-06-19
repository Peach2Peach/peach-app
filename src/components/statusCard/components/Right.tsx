import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { priceFormat } from '../../../utils/string'
import { BTCAmount } from '../../bitcoin'
import { Text } from '../../text'
import { FixedHeightText } from '../../text/FixedHeightText'
import { getPropsWithType } from '../helpers'
import { StatusCardProps } from '../StatusCard'

export type Props = Pick<StatusCardProps, 'amount' | 'price' | 'currency'>

export const Right = (propsWithoutType: StatusCardProps) => {
  const { type, amount, price, currency } = getPropsWithType(propsWithoutType)
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
