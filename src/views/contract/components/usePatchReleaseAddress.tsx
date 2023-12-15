import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { peachAPI } from '../../../utils/peachAPI'

export const usePatchReleaseAddress = (offerId: string, contractId: string) => {
  const queryClient = useQueryClient()
  const showErrorBanner = useShowErrorBanner()

  return useMutation({
    onMutate: async ({ releaseAddress }) => {
      await queryClient.cancelQueries({ queryKey: ['offer', offerId] })
      await queryClient.cancelQueries({ queryKey: ['contract', contractId] })
      const previousOfferData = queryClient.getQueryData<BuyOffer | SellOffer>(['offer', offerId])
      const previousContractData = queryClient.getQueryData<Contract>(['contract', contractId])
      queryClient.setQueryData(
        ['offer', offerId],
        (oldQueryData: BuyOffer | SellOffer | undefined) => oldQueryData && { ...oldQueryData, releaseAddress },
      )
      queryClient.setQueryData(
        ['contract', contractId],
        (oldQueryData: Contract | undefined) =>
          oldQueryData && {
            ...oldQueryData,
            releaseAddress,
          },
      )

      return { previousOfferData, previousContractData }
    },
    mutationFn: async (newData: { releaseAddress: string; messageSignature: string }) => {
      const { error } = await peachAPI.private.offer.patchOffer({ offerId, ...newData })
      if (error) throw new Error(error.error)
    },
    onError: (err: Error, _variables, context) => {
      queryClient.setQueryData(['offer', offerId], context?.previousOfferData)
      queryClient.setQueryData(['contract', contractId], context?.previousContractData)
      showErrorBanner(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['offer', offerId])
      queryClient.invalidateQueries(['contract', contractId])
    },
  })
}