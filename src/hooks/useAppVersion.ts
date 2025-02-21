import { useQuery } from "@tanstack/react-query";
import { peachAPI } from "../utils/peachAPI";
import { systemKeys } from "../views/addPaymentMethod/usePaymentMethodInfo";

export function useAppVersion() {
  return useQuery({
    queryKey: systemKeys.version(),
    queryFn: async () => {
      const { result } = await peachAPI.public.system.getVersion();
      if (result) return result;
      throw new Error("Could not fetch version");
    },
  });
}
