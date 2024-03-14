import { useQueries, useQuery } from "@tanstack/react-query";
import { MSINAMINUTE } from "../../constants";
import { getOfferQuery } from "./getOfferQuery";

export const offerKeys = {
  all: ["offers"] as const,
  summaries: () => [...offerKeys.all, "summaries"] as const,
  summary: (id: string) => [...offerKeys.summaries(), id] as const,
  details: () => [...offerKeys.all, "details"] as const,
  detail: (id?: string) => [...offerKeys.details(), id] as const,
  fundingStatus: (id: string) =>
    [...offerKeys.detail(id), "fundingStatus"] as const,
};

export const useOfferDetail = (id?: string) => {
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

function buildQuery(id?: string) {
  return {
    queryKey: offerKeys.detail(id),
    queryFn: getOfferQuery,
    staleTime: MSINAMINUTE,
    enabled: !!id,
  };
}
