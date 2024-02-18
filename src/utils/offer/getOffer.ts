import { getOfferQuery } from "../../hooks/query/getOfferQuery";
import { offerKeys } from "../../hooks/query/useOfferDetail";
import { queryClient } from "../../queryClient";

export async function getOffer(id: string) {
  try {
    const data = await queryClient.fetchQuery({
      queryKey: offerKeys.detail(id),
      queryFn: getOfferQuery,
    });
    return data;
  } catch (err) {
    return null;
  }
}
