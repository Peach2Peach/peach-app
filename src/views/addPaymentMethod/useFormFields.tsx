import { useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../utils/peachAPI";

export const systemKeys = {
  paymentMethods: ["paymentMethods"] as const,
  news: ["news"] as const,
};

export function useFormFields(paymentMethod: PaymentMethod) {
  const queryData = useQuery({
    queryKey: systemKeys.paymentMethods,
    queryFn: async () => {
      const { result, error } =
        await peachAPI.public.system.getPaymentMethodInfo({ paymentMethod });

      if (error) {
        throw error;
      }

      return result;
    },
  });

  const fields = queryData.data?.fields;
  return fields;
}
