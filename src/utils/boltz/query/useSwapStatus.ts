import { useQuery } from "@tanstack/react-query";
import { MSINASECOND } from "../../../constants";
import { getSwapStatus } from "../api/getSwapStatus";


const queryFn = async ({ queryKey }: { queryKey: ['boltz', 'reverse', 'status', string] }) => {
  const [,,, id] = queryKey
  const { result, error: err } =
    await getSwapStatus({ id });

  if (err) throw new Error(err.error);
  return result;
}


type Props = {
  id?: string
}

const REFETCH_INTERVAL = 5
export const useSwapStatus = ({ id }: Props) => {
  const {data, isLoading } = useQuery({
    queryKey: ['boltz', 'reverse', 'status', id || ''],
    queryFn,
    refetchInterval: REFETCH_INTERVAL * MSINASECOND,
    enabled: !!id
  })
  return { status: data, isLoading }
}
