import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BTCAmount } from '../bitcoin/BTCAmount'
import { FixedHeightText } from '../text/FixedHeightText'
import { infoContainerStyle } from './infoContainerStyle'

export function BitcoinAmountInfo ({ amount, premium }: { amount: number; premium?: number }) {
  return (
    <View style={[infoContainerStyle, tw`gap-6px`]}>
      <BTCAmount size="small" amount={amount} />
      {premium !== undefined && (
        <FixedHeightText style={tw`body-m text-black-65`} height={17}>
          {premium}% {i18n('offer.summary.premium')}
        </FixedHeightText>
      )}
    </View>
  )
}
