import { useQuery } from "@tanstack/react-query";
import { MSINANHOUR } from "../../../constants";
import { getSubmarineSwaps } from "../api/getSubmarineSwaps";

const queryFn = async () => {
  const { result, error: err } = await getSubmarineSwaps();

  if (err) throw new Error(err.error);
  return result;
};

export const useSubmarineSwaps = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["boltz", "swaps", "submarine"],
    queryFn,
    staleTime: MSINANHOUR
  });
  return { submarineList: data, isLoading };
};
