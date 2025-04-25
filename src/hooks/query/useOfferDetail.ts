import { useQueries, useQuery } from "@tanstack/react-query";
import { MSINAMINUTE } from "../../constants";
import { getOfferQuery } from "./getOfferQuery";
import { offerKeys } from "./offerKeys";

export const useOfferDetail = (id: string) => {
  const {
    data,
    isLoading,
    isFetching,
    error: offerDetailsError,
  } = useQuery(buildQuery(id));

  return { offer: data, isLoading, isFetching, error: offerDetailsError };
};

export const useMultipleOfferDetails = (ids: string[]) => {
  const queries = useQueries({ queries: ids.map(buildQuery) });

  const isPending = queries.some((query) => query.isPending);
  const isLoading = queries.some((query) => query.isLoading);
  const isFetching = queries.some((query) => query.isFetching);
  const errors = queries.map((query) => query.error);
  const offers = queries.map((query) => query.data);

  return { offers, isLoading, isFetching, isPending, errors };
};

function buildQuery(id: string) {
  return {
    queryKey: offerKeys.detail(id),
    queryFn: getOfferQuery,
    staleTime: MSINAMINUTE,
    enabled: !!id,
  };
}
