import { useEffect, useState } from 'react'
import { useRoute } from '../../../hooks'
import { account } from '../../../utils/account'
import { logTradeCompleted } from '../../../utils/analytics'
import { getContractViewer } from '../../../utils/contract'

export const useTradeCompleteSetup = () => {
  const route = useRoute<'tradeComplete'>()
  const [contract, setContract] = useState<Contract>(route.params.contract)
  const view = getContractViewer(route.params.contract, account)

  const [vote, setVote] = useState<'positive' | 'negative'>()

  const saveAndUpdate = setContract

  useEffect(() => {
    setContract(() => route.params.contract)
  }, [route])

  useEffect(() => {
    logTradeCompleted(contract)
  }, [])

  return { view, vote, setVote, contract, saveAndUpdate }
}
