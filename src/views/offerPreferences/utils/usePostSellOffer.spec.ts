import { act, renderHook, waitFor } from "test-utils";
import { sellOffer } from "../../../../tests/unit/data/offerData";
import { validSEPAData } from "../../../../tests/unit/data/paymentData";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { peachAPI } from "../../../utils/peachAPI";
import { PeachLiquidJSWallet } from "../../../utils/wallet/PeachLiquidJSWallet";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import {
  setLiquidWallet,
  setPeachWallet,
} from "../../../utils/wallet/setWallet";
import { usePostSellOffer } from "./usePostSellOffer";

const postSellOfferMock = jest.spyOn(peachAPI.private.offer, "postSellOffer");

jest.useFakeTimers();

describe("usePostSellOffer", () => {
  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
    setLiquidWallet(new PeachLiquidJSWallet({ wallet: createTestWallet() }));
  });
  const offerDraft: SellOfferDraft = {
    ...sellOffer,
    originalPaymentData: [validSEPAData],
  };

  it("should call postSellOffer with offerDraft", async () => {
    const { result } = renderHook(usePostSellOffer);

    act(() => {
      result.current.mutate(offerDraft);
    });

    await waitFor(() => {
      expect(postSellOfferMock).toHaveBeenCalledWith({
        amount: offerDraft.amount,
        multi: undefined,
        meansOfPayment: offerDraft.meansOfPayment,
        paymentData: offerDraft.paymentData,
        premium: offerDraft.premium,
        returnAddress: offerDraft.returnAddress,
        returnAddressLiquid: "ex1qghkn6w7wwgypm78wruw8ecr9s9rtex53dmwrj4",
        type: "ask",
        fundingMechanism: "bitcoin",
      });
    });
  });
});
