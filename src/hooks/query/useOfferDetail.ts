import {
  QueryFunctionContext,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import { MSINAMINUTE } from "../../constants";
import { error } from "../../utils/log/error";
import { getOffer } from "../../utils/offer/getOffer";
import { saveOffer } from "../../utils/offer/saveOffer";
import { peachAPI } from "../../utils/peachAPI";

export const offerKeys = {
  all: ["offers"] as const,
  summaries: () => [...offerKeys.all, "summaries"] as const,
  summary: (id: string) => [...offerKeys.summaries(), id] as const,
  details: () => [...offerKeys.all, "details"] as const,
  detail: (id: string) => [...offerKeys.details(), id] as const,
  fundingStatus: (id: string) =>
    [...offerKeys.detail(id), "fundingStatus"] as const,
};

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

  const isLoading = queries.some((query) => query.isLoading);
  const isFetching = queries.some((query) => query.isFetching);
  const errors = queries.map((query) => query.error);
  const offers = queries.map((query) => query.data);

  return { offers, isLoading, isFetching, errors };
};

function buildQuery(id: string) {
  const initialOffer = getOffer(id);

  return {
    queryKey: offerKeys.detail(id),
    queryFn: getOfferQuery,
    initialData: initialOffer,
    initialDataUpdatedAt: initialOffer?.lastModified?.getTime(),
    staleTime: MSINAMINUTE,
    enabled: !!id,
  };
}

async function getOfferQuery({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof offerKeys.detail>>) {
  const offerId = queryKey[2];
  const { result: offer, error: err } =
    await peachAPI.private.offer.getOfferDetails({ offerId });

  if (err) {
    error("Could not fetch offer information for offer", offerId, err.error);
    throw new Error(err.error);
  }
  if (!offer) {
    throw new Error("NOT_FOUND");
  }
  saveOffer(offer);
  return offer;
}
