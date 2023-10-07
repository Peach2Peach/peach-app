import { createContext } from 'react'

type ContractContextType = {
  contract: Contract
  view: ContractViewer
  showBatchInfo: boolean
  toggleShowBatchInfo: () => void
}

export const ContractContext = createContext<ContractContextType | undefined>(undefined)
