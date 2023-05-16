import { createContext } from 'react'

type ContractContextType = {
  contract: Contract
  view: ContractViewer
}

export const ContractContext = createContext<ContractContextType | undefined>(undefined)
