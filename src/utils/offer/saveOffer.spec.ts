import * as offerData from "../../../tests/unit/data/offerData";
import { offerKeys } from "../../hooks/query/useOfferDetail";
import { queryClient } from "../../queryClient";
import { useTradeSummaryStore } from "../../store/tradeSummaryStore";
import { saveOffer } from "./saveOffer";

describe("saveOffer", () => {
  it("should update the query cache", () => {
    saveOffer(offerData.buyOffer);
    expect(
      queryClient.getQueryData(offerKeys.detail(offerData.buyOffer.id)),
    ).toEqual(offerData.buyOffer);
  });
  it("should add a new offer to the storages", () => {
    saveOffer(offerData.buyOffer);
    saveOffer(offerData.sellOffer);
    expect(
      useTradeSummaryStore.getState().getOffer(offerData.buyOffer.id),
    ).toEqual(offerData.buyOffer);
    expect(
      useTradeSummaryStore.getState().getOffer(offerData.sellOffer.id),
    ).toEqual(offerData.sellOffer);
  });
  it("should update an existing offer", () => {
    expect(
      useTradeSummaryStore.getState().getOffer(offerData.buyOffer.id),
    ).toEqual(offerData.buyOffer);
    saveOffer({
      ...offerData.buyOffer,
      matches: ["38"],
    });
    expect(
      useTradeSummaryStore.getState().getOffer(offerData.buyOffer.id),
    ).toEqual({
      ...offerData.buyOffer,
      matches: ["38"],
    });
  });
});
