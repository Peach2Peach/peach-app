import { contract } from "../../../peach-api/src/testData/contract";
import { getError, getResult } from "../../../peach-api/src/utils/result";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { peachAPI } from "../../utils/peachAPI";
import { patchSellOfferWithRefundTx } from "./patchSellOfferWithRefundTx";

jest.useFakeTimers();

jest.mock("../../utils/contract/getSellOfferFromContract");
jest
  .requireMock("../../utils/contract/getSellOfferFromContract")
  .getSellOfferFromContract.mockReturnValue(sellOffer);

jest.mock("../../utils/bitcoin/checkRefundPSBT", () => ({
  checkRefundPSBT: jest.fn().mockReturnValue({
    isValid: true,
    psbt: {
      toBase64: () => "psbt",
    },
  }),
}));
jest.mock("../../utils/wallet/getEscrowWalletForOffer", () => ({
  getEscrowWalletForOffer: jest.fn().mockReturnValue({}),
}));

jest.mock("../../utils/wallet/signPSBT", () => ({
  signPSBT: jest.fn().mockReturnValue({ toBase64: () => "psbt" }),
}));
const patchOfferMock = jest.spyOn(peachAPI.private.offer, "patchOffer");

describe("cancelContractAsSeller", () => {
  it("doesn't sign a psbt if refundPSBT is invalid, has an error, or is undefined", async () => {
    jest
      .spyOn(
        jest.requireMock("../../utils/bitcoin/checkRefundPSBT"),
        "checkRefundPSBT",
      )
      .mockReturnValueOnce({
        isValid: false,
        psbt: "psbt",
        err: undefined,
      })
      .mockReturnValueOnce({
        isValid: true,
        psbt: undefined,
        err: "error",
      })
      .mockReturnValueOnce({
        isValid: true,
        psbt: undefined,
        err: undefined,
      });
    const signPSBTSpy = jest.spyOn(
      jest.requireMock("../../utils/wallet/signPSBT"),
      "signPSBT",
    );
    await patchSellOfferWithRefundTx(contract, "psbt");
    await patchSellOfferWithRefundTx(contract, "psbt");
    await patchSellOfferWithRefundTx(contract, "psbt");

    expect(signPSBTSpy).not.toHaveBeenCalled();
  });
  it("calls patchOffer and saves the new refundTx", async () => {
    const saveOfferSpy = jest.spyOn(
      jest.requireActual("../../utils/offer/saveOffer"),
      "saveOffer",
    );
    patchOfferMock.mockResolvedValueOnce(getResult({ success: true }));
    await patchSellOfferWithRefundTx(contract, "psbt");
    expect(patchOfferMock).toHaveBeenCalledWith({
      offerId: sellOffer.id,
      refundTx: "psbt",
    });
    expect(saveOfferSpy).toHaveBeenCalledWith({
      ...sellOffer,
      refundTx: "psbt",
    });
  });
  it("doesn't save the new refundTx if patchOffer fails", async () => {
    const saveOfferSpy = jest.spyOn(
      jest.requireActual("../../utils/offer/saveOffer"),
      "saveOffer",
    );
    patchOfferMock.mockResolvedValueOnce(
      getError({ error: "INTERNAL_SERVER_ERROR" }),
    );
    await patchSellOfferWithRefundTx(contract, "psbt");
    expect(saveOfferSpy).not.toHaveBeenCalled();
  });
});
