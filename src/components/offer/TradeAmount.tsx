import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { PriceFormat, Text } from '../text'
import { CopyAble } from '../ui'

type Props = Pick<Contract, 'price' | 'currency' | 'disputeActive'> & {
  isBuyer: boolean
}

export const TradeAmount = ({ price, currency, disputeActive, isBuyer }: Props) => (
  <View style={tw`flex-row items-center mt-2`}>
    <Text style={[tw`text-black-2 w-25`, disputeActive && tw`text-error-light`]}>{i18n('amount')}</Text>
    <View style={tw`flex-row items-center`}>
      <PriceFormat style={[tw`subtitle-1`, disputeActive && tw`text-error-dark`]} amount={price} currency={currency} />
      {isBuyer && (
        <CopyAble value={price.toFixed(2)} style={tw`ml-2`} color={disputeActive ? tw`text-error-main` : undefined} />
      )}
    </View>
  </View>
)
