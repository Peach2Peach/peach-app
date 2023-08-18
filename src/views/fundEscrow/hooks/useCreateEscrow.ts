import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getPublicKeyForEscrow, getWallet } from '../../../utils/wallet'
import { createEscrow } from '../../../utils/peachAPI'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { parseError } from '../../../utils/result'

const createEscrowFn = async (offerId: string) => {
  const publicKey = getPublicKeyForEscrow(getWallet(), offerId)

  const [result, err] = await createEscrow({
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
