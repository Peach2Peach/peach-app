import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { Card, paymentDetailTemplates, SatsFormat, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'


type ContractDetailsProps = {
  contract: Contract,
  view: 'seller' | 'buyer' | ''
}

export default ({ contract, view }: ContractDetailsProps): ReactElement => {
  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null

  return <Card style={[
    tw`p-4`,
    contract.canceled ? tw`opacity-50` : {}
  ]}>
    {contract.canceled
      ? <Text style={tw`text-red`}>Canceled</Text>
      : null
    }
    <View style={tw`flex-row`}>
      <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>
        {i18n(view === 'seller' ? 'buyer' : 'seller')}:
      </Text>
      {view === 'seller'
        ? <Text style={tw`w-5/8`}>
          {contract.buyer.id.substring(0, 8)}
        </Text>
        : <Text style={tw`w-5/8`}>
          {contract.seller.id.substring(0, 8)}
        </Text>
      }
    </View>
    <View style={tw`flex-row mt-3`}>
      <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('amount')}:</Text>
      <Text style={tw`w-5/8`}>
        <SatsFormat sats={contract.amount} color={tw`text-black-1`} />
      </Text>
    </View>
    <View style={tw`flex-row mt-3`}>
      <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('price')}:</Text>
      <View style={tw`w-5/8`}>
        <View>
          <Text>
            {i18n(
              `currency.format.${contract.currency}`,
              contract.price.toFixed(2)
            )}
          </Text>
        </View>
      </View>
    </View>
    <View style={tw`flex-row mt-3`}>
      <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('currency')}:</Text>
      <View style={tw`w-5/8`}>
        <Text>{contract.currency}</Text>
      </View>
    </View>
    <View style={tw`flex-row mt-3`}>
      <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('payment')}:</Text>
      <View style={tw`w-5/8`}>
        <Text>{i18n(`paymentMethod.${contract.paymentMethod}`)}</Text>
      </View>
    </View>
    {contract.paymentData && PaymentTo
      ? <View style={tw`flex-row mt-3`}>
        <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('contract.payment.to')}:</Text>
        <View style={tw`w-5/8`}>
          <PaymentTo paymentData={contract.paymentData}/>
        </View>
      </View>
      : null
    }
  </Card>
}