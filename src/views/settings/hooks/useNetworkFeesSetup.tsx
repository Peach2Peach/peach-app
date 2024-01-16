import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { User } from '../../../../peach-api/src/@types/user'
import { useSetToast } from '../../../components/toast/Toast'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useValidatedState } from '../../../hooks/useValidatedState'
import { updateUser } from '../../../utils/peachAPI/updateUser'

const customFeeRules = {
  required: true,
  feeRate: true,
}
export const useNetworkFeesSetup = () => {
  const setToast = useSetToast()

  const { user } = useSelfUser()
  const feeRate = user?.feeRate

  const defaultFeeRate = feeRate ? (typeof feeRate === 'number' ? 'custom' : feeRate) : 'halfHourFee'
  const [selectedFeeRate, setSelectedFeeRate] = useState<FeeRate | 'custom'>()
  const displayRate = selectedFeeRate ?? defaultFeeRate

  const defaultCustomFeeRate = typeof feeRate === 'number' ? feeRate.toString() : ''
  const [customFeeRate, setCustomFeeRate, isValidCustomFeeRate] = useValidatedState<string | undefined>(
    undefined,
    customFeeRules,
  )
  const displayCustomRate = customFeeRate ?? defaultCustomFeeRate

  const queryClient = useQueryClient()
  const finalFeeRate = displayRate === 'custom' ? Number(displayCustomRate) : displayRate
  const { mutate } = useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['user', 'self'])
      const previousData = queryClient.getQueryData(['user', 'self'])
      queryClient.setQueryData<User>(['user', 'self'], (old) => {
        if (!old) return old
        return {
          ...old,
          feeRate: finalFeeRate,
        }
      })
      return { previousData }
    },
    mutationFn: async () => {
      const [_result, err] = await updateUser({ feeRate: finalFeeRate })
      if (err) throw new Error(err.error)
    },
    onError: (err: Error, variables, context) => {
      queryClient.setQueryData(['user', 'self'], context?.previousData)
      setToast({ msgKey: err.message, color: 'red' })
    },
    onSettled: () => {
      queryClient.invalidateQueries(['user', 'self'])
    },
  })

  const onChangeCustomFeeRate = (value: string) =>
    setCustomFeeRate(!value || isNaN(Number(value)) || value === '0' ? '' : value)

  return {
    selectedFeeRate: displayRate,
    setSelectedFeeRate,
    customFeeRate: displayCustomRate,
    setCustomFeeRate: onChangeCustomFeeRate,
    submit: () => mutate(),
    isValid: selectedFeeRate !== 'custom' || isValidCustomFeeRate,
    feeRateSet: displayRate === 'custom' ? feeRate === Number(displayCustomRate) : feeRate === displayRate,
  }
}
