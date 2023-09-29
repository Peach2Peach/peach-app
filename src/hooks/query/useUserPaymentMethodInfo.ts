import { useQuery } from '@tanstack/react-query'
import { getUserPaymentMethodInfo } from '../../utils/peachAPI'

const getUserPaymentMethodInfoQuery = async () => {
  const [data, error] = await getUserPaymentMethodInfo({})

  if (error) throw new Error(error.error)
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
