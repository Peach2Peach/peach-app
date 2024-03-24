import { sellOffer } from "../../../peach-api/src/testData/offers";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { getOfferQuery } from "./getOfferQuery";

jest.useFakeTimers();

describe("getOfferQuery.spec", () => {
  afterEach(() => {
    queryClient.clear();
  });
  it("fetches offer from API", async () => {
    const queryKey = ["offers", "details", sellOffer.id] as const;
    const result = await getOfferQuery({
      queryKey,
      signal: new AbortController().signal,
      meta: undefined,
    });

    expect(result).toEqual(sellOffer);
    expect(queryClient.getQueryData(queryKey)).toEqual(sellOffer);
  });
});
