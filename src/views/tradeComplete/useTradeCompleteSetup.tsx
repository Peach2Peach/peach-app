import analytics from '@react-native-firebase/analytics'
import { useEffect, useState } from 'react'
import { useRoute } from '../../hooks'
import { account } from '../../utils/account'
import { getContractViewer, saveContract } from '../../utils/contract'

export const useTradeCompleteSetup = () => {
  const route = useRoute<'tradeComplete'>()
  const [contract, setContract] = useState<Contract>(route.params.contract)
  const view = getContractViewer(route.params.contract, account)

  const [vote, setVote] = useState<'positive' | 'negative'>()

  const saveAndUpdate = (contractData: Contract) => {
    setContract(contractData)
    saveContract(contractData)
  }

  useEffect(() => {
    setContract(() => route.params.contract)
  }, [route])

  useEffect(() => {
    analytics().logEvent('trade_completed', {
      amount: contract.amount,
      value: contract.price,
      currency: contract.currency,
      payment_method: contract.paymentMethod,
    })
  }, [])

  return { contract, view, vote, setVote, saveAndUpdate }
}
