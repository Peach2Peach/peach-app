import { createContext } from 'react'

type ContractContextType = {
  contract: Contract
  view: ContractViewer
  showBatchInfo: boolean
  toggleShowBatchInfo: () => void
  saveAndUpdate: (contractData: Partial<Contract>) => void
}

export const ContractContext = createContext<ContractContextType | undefined>(undefined)
