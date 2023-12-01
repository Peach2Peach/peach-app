import { useQuery } from '@tanstack/react-query'
import { peachAPI } from '../../utils/peachAPI'

const getUserPaymentMethodInfoQuery = async () => {
  const { result: data, error } = await peachAPI.private.user.getUserPaymentMethodInfo()

  if (error) throw new Error(error.error || 'Could not fetch payment methods')
  return data
}

export const placeholder = {
  forbidden: {
    buy: [],
    sell: [],
  },
}

export const useUserPaymentMethodInfo = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', 'self', 'paymentMethodInfo'],
    queryFn: getUserPaymentMethodInfoQuery,
  })
  return { data: data || placeholder, isLoading, error }
}
