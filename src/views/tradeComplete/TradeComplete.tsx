import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import analytics from '@react-native-firebase/analytics'

import tw from '../../styles/tailwind'

import { BigTitle, PeachScrollView } from '../../components'
import { account, updateTradingLimit } from '../../utils/account'
import { saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getTradingLimit } from '../../utils/peachAPI'
import Rate from './components/Rate'
import { useRoute } from '../../hooks'

export default (): ReactElement => {
  const route = useRoute<'tradeComplete'>()
  const [contract, setContract] = useState<Contract>(route.params.contract)
  const [view, setView] = useState<'seller' | 'buyer' | ''>('')

  const saveAndUpdate = (contractData: Contract) => {
    setContract(() => contractData)
    saveContract(contractData)
  }

  useEffect(() => {
    setContract(() => route.params.contract)
    setView(() => (account.publicKey === route.params.contract.seller.id ? 'seller' : 'buyer'))
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
    <PeachScrollView style={tw`flex h-full px-6 pb-10`}>
      <View style={tw`flex justify-center flex-shrink`}>
        <BigTitle title={i18n(`tradeComplete.title.${view}.default`)} />
      </View>
      <Rate style={tw`flex flex-shrink pb-10`} {...{ contract, view, saveAndUpdate }} />
    </PeachScrollView>
  )
}
