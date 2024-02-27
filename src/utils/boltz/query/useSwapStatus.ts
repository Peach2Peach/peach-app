import { useQuery } from "@tanstack/react-query";
import { MSINASECOND } from "../../../constants";
import { getSwapStatus } from "../api/getSwapStatus";

const queryFn = async ({
  queryKey,
}: {
  queryKey: ["boltz", "swap", "status", string];
}) => {
  const [, , , id] = queryKey;
  const { result, error: err } = await getSwapStatus({ id });

  if (err) throw new Error(err.error);
  return result;
};

type Props = {
  id?: string;
  enabled?: boolean;
  refetch?: boolean;
};

const REFETCH_INTERVAL = 5;
export const useSwapStatus = ({
  id,
  enabled = true,
  refetch = true,
}: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["boltz", "swap", "status", id || ""],
    queryFn,
    refetchInterval: refetch ? REFETCH_INTERVAL * MSINASECOND : undefined,
    enabled: enabled && !!id,
  });
  return { status: data, isLoading };
};
