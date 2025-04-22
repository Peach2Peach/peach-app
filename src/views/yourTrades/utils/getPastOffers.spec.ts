import {
  buyOfferSummary,
  canceledOfferSummary,
} from "../../../../tests/unit/data/offerSummaryData";
import { getPastOffers } from "./getPastOffers";

describe("getPastOffers", () => {
  const openOffer = buyOfferSummary;
  const canceledOffer = canceledOfferSummary;
  it("should return past offers of trades", () => {
    expect(getPastOffers([openOffer, canceledOffer])).toEqual([canceledOffer]);
  });
});
