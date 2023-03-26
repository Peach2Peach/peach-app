import { useMemo } from 'react';
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getPaymentDataByMethod } from '../../utils/offer'
import { hashPaymentData } from '../../utils/paymentMethod'
import { PaymentMethod } from '../matches/PaymentMethod'
import { PriceFormat, SatsFormat, Text } from '../text'
import { getBitcoinPriceFromContract } from '../../utils/contract'

export const CompletedTradeDetails = ({
  currency,
  price,
  amount,
  paymentMethod,
  isBuyer,
  paymentData,
  premium,
}: Contract & { isBuyer: boolean }) => {
  const paymentMethodLabel = useMemo(
    () => (paymentData ? getPaymentDataByMethod(paymentMethod, hashPaymentData(paymentData))?.label : null),
    [paymentData, paymentMethod],
  )
  return (
    <View>
      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`text-black-2`}>{i18n(`contract.summary.${isBuyer ? 'youPaid' : 'hasPaidYou'}`)}</Text>
        <PriceFormat currency={currency} amount={price} style={tw`subtitle-1`} />
      </View>

      <View style={tw`flex-row items-center justify-between my-3`}>
        <Text style={tw`text-black-2`}>{i18n('contract.summary.for')}</Text>
        <SatsFormat
          sats={amount}
          style={tw`font-semibold subtitle-1`}
          bitcoinLogoStyle={tw`w-4 h-4 mr-1`}
          satsStyle={tw`font-normal body-s`}
        />
      </View>

      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`text-black-2`}>{i18n(`contract.summary.${isBuyer ? 'via' : 'to'}`)}</Text>
        {isBuyer || !paymentMethodLabel ? (
          <PaymentMethod paymentMethod={paymentMethod} />
        ) : (
          <Text style={tw`subtitle-1`}>{paymentMethodLabel}</Text>
        )}
      </View>

      {!isBuyer && (
        <View style={tw`flex-row items-center justify-between mt-3`}>
          <Text style={tw`text-black-2`}>{i18n('contract.summary.btcPrice')}</Text>
          <PriceFormat
            style={tw`subtitle-1`}
            currency={currency}
            amount={getBitcoinPriceFromContract({ price, premium, amount })}
          />
        </View>
      )}
    </View>
  )
}
