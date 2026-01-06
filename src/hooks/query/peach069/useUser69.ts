import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../../utils/peachAPI";

export const user69DetailsKeys = {
  all: ["peach069user"] as const,
  details: () => [...user69DetailsKeys.all, "details"] as const,
};

export const useUser69Details = () => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: user69DetailsKeys.details(),
    queryFn: getUser69Details,
  });

  return { user: data, isLoading, isFetching, refetch, error };
};

async function getUser69Details({}: QueryFunctionContext<
  ReturnType<typeof user69DetailsKeys.details>
>) {
  const { result } = await peachAPI.private.peach069.getSelfUser69();

  return result?.user;
}
