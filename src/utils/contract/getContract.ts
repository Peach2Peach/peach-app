import { account } from '../account'

export const getContract = (id: string) => {
  const contract = account.contracts.find((c) => c.id === id)

  if (!contract) return undefined

  return contract
}
