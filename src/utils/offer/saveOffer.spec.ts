import * as offerData from "../../../tests/unit/data/offerData";
import { offerKeys } from "../../hooks/query/useOfferDetail";
import { queryClient } from "../../queryClient";
import { saveOffer } from "./saveOffer";

describe("saveOffer", () => {
  afterEach(() => {
    queryClient.clear();
  });
  it("should update the query cache", () => {
    saveOffer(offerData.buyOffer);
    expect(
      queryClient.getQueryData(offerKeys.detail(offerData.buyOffer.id)),
    ).toEqual(offerData.buyOffer);
  });
  it("should add a new offer to the storages", () => {
    saveOffer(offerData.buyOffer);
    saveOffer(offerData.sellOffer);
    expect(queryClient.getQueryData(offerKeys.summaries())).toEqual([
      offerData.buyOffer,
      offerData.sellOffer,
    ]);
  });
  it("should update an existing offer", () => {
    saveOffer(offerData.buyOffer);
    expect(queryClient.getQueryData(offerKeys.summaries())).toEqual([
      offerData.buyOffer,
    ]);
    saveOffer({
      ...offerData.buyOffer,
      matches: ["38"],
    });
    expect(queryClient.getQueryData(offerKeys.summaries())).toEqual([
      {
        ...offerData.buyOffer,
        matches: ["38"],
      },
    ]);
  });
});
