import { useQuery } from '@tanstack/react-query'
import { decryptContractData } from '../../utils/contract'

export const useDecryptedContractData = (contract: Contract) =>
  useQuery({
    queryKey: ['contract', contract.id, 'decrytedData'],
    queryFn: async () => {
      const { symmetricKey, paymentData } = await decryptContractData(contract)
      if (!symmetricKey || !paymentData) throw new Error('Could not decrypt contract data')
      return { symmetricKey, paymentData }
    },
  })
