import { useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../utils/peachAPI";

export function usePeachInfo() {
  return useQuery({
    queryKey: ["public", "system", "getInfo"],
    queryFn: () => peachAPI.public.system.getInfo(),
  });
}
