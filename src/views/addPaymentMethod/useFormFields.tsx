import { useQuery } from '@tanstack/react-query'
import { peachAPI } from '../../utils/peachAPI'

export function useFormFields (paymentMethod: PaymentMethod) {
  const queryData = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: async () => {
      const { result, error } = await peachAPI.public.system.getPaymentMethodInfo({ paymentMethod })

      if (error) {
        throw error
      }

      return result
    },
  })

  const fields = queryData.data?.fields
  return fields
}
