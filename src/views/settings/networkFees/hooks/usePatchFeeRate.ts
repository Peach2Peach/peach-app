import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from '../../../../../peach-api/src/@types/user'
import { useSetToast } from '../../../../components/toast/Toast'
import { updateUser } from '../../../../utils/peachAPI/updateUser'

export function usePatchFeeRate () {
  const setToast = useSetToast()
  const queryClient = useQueryClient()

  return useMutation({
    onMutate: async ({ feeRate }) => {
      await queryClient.cancelQueries({ queryKey: ['user', 'self'] })
      const previousData = queryClient.getQueryData(['user', 'self'])
      queryClient.setQueryData<User>(['user', 'self'], (old) => {
        if (!old) return old
        return {
          ...old,
          feeRate,
        }
      })
      return { previousData }
    },
    mutationFn: async ({ feeRate }: { feeRate: FeeRate }) => {
      const { error } = await updateUser({ feeRate })
      if (error) throw new Error(error.error)
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(['user', 'self'], context?.previousData)
      setToast({ msgKey: err.message, color: 'red' })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['user', 'self'] }),
  })
}
