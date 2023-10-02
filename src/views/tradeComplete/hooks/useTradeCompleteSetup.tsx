import { useEffect, useState } from 'react'
import { useRoute } from '../../../hooks'
import { logTradeCompleted } from '../../../utils/analytics'
import { getContractViewer, saveContract } from '../../../utils/contract'

export const useTradeCompleteSetup = () => {
  const route = useRoute<'tradeComplete'>()
  const [contract, setContract] = useState<Contract>(route.params.contract)
  const view = getContractViewer(route.params.contract.seller.id)

  const [vote, setVote] = useState<'positive' | 'negative'>()

  const saveAndUpdate = (contractData: Contract) => {
    setContract(contractData)
    saveContract(contractData)
  }

  useEffect(() => {
    setContract(() => route.params.contract)
  }, [route])

  useEffect(() => {
    logTradeCompleted(contract)
  }, [])

  return { view, vote, setVote, contract, saveAndUpdate }
}
