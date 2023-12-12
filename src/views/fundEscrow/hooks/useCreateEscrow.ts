import { useMutation } from '@tanstack/react-query'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { peachAPI } from '../../../utils/peachAPI'
import { parseError } from '../../../utils/result/parseError'
import { getPublicKeyForEscrow, getWallet } from '../../../utils/wallet'

const createEscrowFn = async (offerId: string) => {
  const publicKey = getPublicKeyForEscrow(getWallet(), offerId)

  const { result, error: err } = await peachAPI.private.offer.createEscrow({
    offerId,
    publicKey,
  })

  if (err) throw new Error(err.error)
  return result
}

export const useCreateEscrow = () => {
  const showErrorBanner = useShowErrorBanner()

  return useMutation({
    mutationFn: (offerIds: string[]) => Promise.all(offerIds.map(createEscrowFn)),
    onError: (err: Error) => showErrorBanner(parseError(err)),
  })
}
