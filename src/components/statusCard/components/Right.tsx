import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { groupChars } from '../../../utils/string/groupChars'
import { priceFormat } from '../../../utils/string/priceFormat'
import { BTCAmount } from '../../bitcoin/btcAmount/BTCAmount'
import { FixedHeightText } from '../../text/FixedHeightText'
import { PeachText } from '../../text/PeachText'
import { StatusCardProps } from '../StatusCard'
import { getPropsWithType } from '../helpers'

export type Props = Pick<StatusCardProps, 'amount' | 'price' | 'currency' | 'replaced' | 'premium'>

export const Right = (propsWithoutType: Props) => {
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
          <PeachText style={tw`font-baloo-medium text-12px leading-19px text-black-3`}>~</PeachText>
          <BTCAmount size="small" amount={amount[1]} />
        </View>
      ) : type === 'fiatAmount' ? (
        <>
          <BTCAmount size="small" amount={amount} />
          <FixedHeightText style={tw`body-m text-black-2`} height={17}>
            {currency === 'SAT' ? groupChars(String(price), 3) : priceFormat(price)} {currency}
          </FixedHeightText>
        </>
      ) : (
        type === 'amount' && (
          <>
            <BTCAmount size="small" amount={amount} />
            {premium !== undefined && (
              <FixedHeightText style={tw`body-m text-black-2`} height={17}>
                {premium}% premium
              </FixedHeightText>
            )}
          </>
        )
      )}
    </View>
  )
}
