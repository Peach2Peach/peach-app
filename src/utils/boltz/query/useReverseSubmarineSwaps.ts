import { useQuery } from "@tanstack/react-query";
import { MSINANHOUR } from "../../../constants";
import { getReverseSubmarineSwaps } from "../api/getReverseSubmarineSwaps";

const queryFn = async () => {
  const { result, error: err } = await getReverseSubmarineSwaps();

  if (err) throw new Error(err.error);
  return result;
};

export const useReverseSubmarineSwaps = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["boltz", "swaps", "reverse"],
    queryFn,
    staleTime: MSINANHOUR,
  });
  return { reverseSubmarineList: data, isLoading };
};
