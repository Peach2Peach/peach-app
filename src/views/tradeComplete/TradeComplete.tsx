import React, { ReactElement, useEffect, useState } from 'react'
import analytics from '@react-native-firebase/analytics'

import tw from '../../styles/tailwind'

import { Icon, Shadow, Text } from '../../components'
import { account, updateTradingLimit } from '../../utils/account'
import { saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getTradingLimit } from '../../utils/peachAPI'
import { Rate } from './components/Rate'
import { useRoute } from '../../hooks'
import { TouchableOpacity, View } from 'react-native'
import { dropShadowMild } from '../../utils/layout'

export default (): ReactElement => {
  const route = useRoute<'tradeComplete'>()
  const [contract, setContract] = useState<Contract>(route.params.contract)
  const view = account.publicKey === route.params.contract.seller.id ? 'seller' : 'buyer'

  const [vote, setVote] = useState<'positive' | 'negative'>()

  const saveAndUpdate = (contractData: Contract) => {
    setContract(() => contractData)
    saveContract(contractData)
  }

  useEffect(() => {
    setContract(() => route.params.contract)
  }, [route])

  useEffect(() => {
    ;(async () => {
      const [tradingLimit] = await getTradingLimit({})

      if (tradingLimit) {
        updateTradingLimit(tradingLimit)
      }
    })()
    analytics().logEvent('trade_completed', {
      amount: contract.amount,
      value: contract.price,
      currency: contract.currency,
      payment_method: contract.paymentMethod,
    })
  }, [])

  return (
    <View style={tw`items-center justify-between h-full px-8 pt-5 pb-10`}>
      <View style={tw`items-center`}>
        <Icon id="fullLogo" />
        <Text style={tw`text-center h4 text-primary-background-light`}>
          {i18n(`tradeComplete.title.${view}.default`)}
        </Text>
      </View>

      <Shadow shadow={dropShadowMild}>
        <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('rate.subtitle')}</Text>
        <View style={tw`flex-row justify-center mt-4`}>
          <TouchableOpacity
            onPress={() => setVote('negative')}
            style={[
              tw`px-4 pb-[13px] pt-[19px] items-center justify-center mr-6`,
              tw`border-[3px] border-primary-background-light rounded-[21px]`,
              vote === 'negative' && tw`bg-primary-background-light`,
            ]}
          >
            <Icon
              id="thumbsDown"
              style={tw`w-8 h-8`}
              color={vote === 'negative' ? tw`text-primary-main`.color : tw`text-primary-background-light`.color}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setVote('positive')}
            style={[
              tw`px-4 pt-[13px] pb-[19px] items-center justify-center ml-6`,
              tw`border-[3px] border-primary-background-light rounded-[21px]`,
              vote === 'positive' && tw`bg-primary-background-light`,
            ]}
          >
            <Icon
              id="thumbsUp"
              style={tw`w-8 h-8`}
              color={vote === 'positive' ? tw`text-primary-main`.color : tw`text-primary-background-light`.color}
            />
          </TouchableOpacity>
        </View>
      </Shadow>
      <Rate {...{ contract, view, vote, saveAndUpdate }} style={tw`self-stretch px-11`} />
    </View>
  )
}
