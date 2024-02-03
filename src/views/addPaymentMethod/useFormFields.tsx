import { useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../utils/peachAPI";

export const systemKeys = {
  all: ["system"] as const,
  paymentMethods: () => [...systemKeys.all, "paymentMethods"] as const,
  news: () => [...systemKeys.all, "news"] as const,
};

export function useFormFields(paymentMethod: PaymentMethod) {
  const queryData = useQuery({
    queryKey: systemKeys.paymentMethods(),
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
