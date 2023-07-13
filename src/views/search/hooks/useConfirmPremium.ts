import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { patchOffer } from '../../../utils/peachAPI'

export const useConfirmPremium = (offerId: string, newPremium: number) => {
  const queryClient = useQueryClient()
  const showErrorBanner = useShowErrorBanner()

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['offer', offerId] })
      const previousData = queryClient.getQueryData<BuyOffer | SellOffer>(['offer', offerId])
      queryClient.setQueryData(
        ['offer', offerId],
        (oldQueryData: BuyOffer | SellOffer | undefined) => oldQueryData && { ...oldQueryData, premium: newPremium },
      )

      return { previousData }
    },
    mutationFn: async () => {
      const [, error] = await patchOffer({ offerId, premium: newPremium })
      if (error) throw new Error(error.error)
    },
    onError: (err: Error, _variables, context) => {
      queryClient.setQueryData(['offer', offerId], context?.previousData)
      showErrorBanner(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['offer', offerId])
    },
  })
}
