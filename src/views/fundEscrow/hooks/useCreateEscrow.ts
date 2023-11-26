import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { peachAPI } from '../../../utils/peachAPI'
import { parseError } from '../../../utils/result'
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

type Props = {
  offerIds: string[]
}
export const useCreateEscrow = ({ offerIds }: Props) => {
  const queryClient = useQueryClient()
  const showErrorBanner = useShowErrorBanner()

  return useMutation({
    mutationFn: () => Promise.all(offerIds.map(createEscrowFn)),
    onError: (err: Error) => showErrorBanner(parseError(err)),
    onSettled: () => {
      offerIds.map((offerId) => queryClient.invalidateQueries({ queryKey: ['offer', offerId] }))
    },
  })
}
