import { act, fireEvent, render, waitFor } from "test-utils";
import { contract } from "../../../peach-api/src/testData/contract";
import { account1 } from "../../../tests/unit/data/accountData";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { GlobalPopup } from "../../components/popup/GlobalPopup";
import { offerKeys } from "../../hooks/query/useOfferDetail";
import { queryClient } from "../../queryClient";
import { setAccount } from "../../utils/account/account";
import { getSellOfferIdFromContract } from "../../utils/contract/getSellOfferIdFromContract";
import { peachAPI } from "../../utils/peachAPI";
import { PeachWallet } from "../../utils/wallet/PeachWallet";
import { setPeachWallet } from "../../utils/wallet/setWallet";
import { ConfirmTradeCancelationPopup } from "./ConfirmTradeCancelationPopup";
import { tolgee } from "../../tolgee";

jest.useFakeTimers();
jest.mock("../../utils/offer/saveOffer");
jest.mock("./patchSellOfferWithRefundTx");

const cancelContractMock = jest.spyOn(
  peachAPI.private.contract,
  "cancelContract",
);

describe("ConfirmTradeCancelationPopup", () => {
  beforeAll(() => {
    queryClient.setQueryData(
      offerKeys.detail(getSellOfferIdFromContract(contract)),
      {
        ...sellOffer,
        id: getSellOfferIdFromContract(contract),
      },
    );
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
  });

  it("should cancel a trade as a buyer", async () => {
    setAccount({ ...account1, publicKey: contract.buyer.id });
    const { getByText, getAllByText } = render(
      <ConfirmTradeCancelationPopup view="buyer" contract={contract} />,
    );

    expect(getByText(tolgee.t("contract.cancel.buyer"))).toBeTruthy();
    act(() => {
      fireEvent.press(getAllByText("cancel trade")[1]);
    });
    await waitFor(() =>
      expect(cancelContractMock).toHaveBeenCalledWith({
        contractId: contract.id,
      }),
    );
  });
  it("should show confirm cancelation popup for seller", async () => {
    queryClient.setQueryData(
      offerKeys.detail(getSellOfferIdFromContract(contract)),
      {
        ...sellOffer,
        id: getSellOfferIdFromContract(contract),
      },
    );
    setAccount({
      ...account1,
      publicKey: contract.seller.id,
    });
    const { getByText, getAllByText } = render(
      <ConfirmTradeCancelationPopup view="seller" contract={contract} />,
    );
    expect(
      getByText(tolgee.t("contract.cancel.seller", { ns: "contract" })),
    ).toBeTruthy();
    act(() => {
      fireEvent.press(getAllByText("cancel trade")[1]);
    });
    await waitFor(() => {
      expect(cancelContractMock).toHaveBeenCalledWith({
        contractId: contract.id,
      });
    });
  });
  it("should show the correct popup for cash trades of the seller", () => {
    const { getByText } = render(
      <ConfirmTradeCancelationPopup
        view="seller"
        contract={{ ...contract, paymentMethod: "cash.someMeetup" }}
      />,
    );
    expect(
      getByText(tolgee.t("contract.cancel.cash.text", { ns: "contract" })),
    ).toBeTruthy();
  });
  it("should show the correct confirmation popup for canceled trade as buyer", async () => {
    setAccount({ ...account1, publicKey: contract.buyer.id });

    const { getAllByText } = render(
      <ConfirmTradeCancelationPopup view="buyer" contract={contract} />,
    );
    await act(async () => {
      await fireEvent.press(getAllByText("cancel trade")[1]);
    });
    const { queryByText } = render(<GlobalPopup />);
    expect(queryByText("cancel trade")).toBeFalsy();
    expect(queryByText("trade canceled!")).toBeTruthy();
  });
  it("should show the correct confirmation popup for canceled trade as seller", async () => {
    queryClient.setQueryData(
      offerKeys.detail(getSellOfferIdFromContract(contract)),
      {
        ...sellOffer,
        id: getSellOfferIdFromContract(contract),
      },
    );
    setAccount({
      ...account1,
      publicKey: contract.seller.id,
    });

    const { getAllByText } = render(
      <ConfirmTradeCancelationPopup view="seller" contract={contract} />,
    );

    await act(async () => {
      await fireEvent.press(getAllByText("cancel trade")[1]);
    });

    const { queryByText } = render(<GlobalPopup />);
    expect(queryByText("cancel trade")).toBeFalsy();
    expect(queryByText("request sent")).toBeTruthy();
    expect(
      queryByText(
        tolgee.t("contract.cancel.requestSent.text", { ns: "contract" }),
      ),
    ).toBeTruthy();
  });
  it("shows the correct confirmation popup for canceled cash trade as seller with republish available", async () => {
    queryClient.setQueryData(
      offerKeys.detail(getSellOfferIdFromContract(contract)),
      {
        ...sellOffer,
        id: getSellOfferIdFromContract(contract),
        publishingDate: new Date(),
      },
    );
    setAccount({
      ...account1,
      publicKey: contract.seller.id,
    });

    const { getByText } = render(
      <ConfirmTradeCancelationPopup
        view="seller"
        contract={{ ...contract, paymentMethod: "cash.someMeetup" }}
      />,
    );

    await act(async () => {
      await fireEvent.press(getByText("cancel trade"));
    });
    const { queryByText } = render(<GlobalPopup />);

    expect(queryByText("cancel trade")).toBeFalsy();
    expect(queryByText("trade canceled")).toBeTruthy();
    expect(
      queryByText(
        tolgee.t("contract.cancel.cash.refundOrRepublish.text", {
          ns: "contract",
        }),
      ),
    ).toBeTruthy();
  });
  it("shows the correct confirmation popup for canceled cash trade as seller with republish unavailable", async () => {
    queryClient.setQueryData(
      offerKeys.detail(getSellOfferIdFromContract(contract)),
      {
        ...sellOffer,
        id: getSellOfferIdFromContract(contract),
        publishingDate: new Date(0),
      },
    );
    setAccount({
      ...account1,
      publicKey: contract.seller.id,
    });

    const { getByText } = render(
      <ConfirmTradeCancelationPopup
        view="seller"
        contract={{ ...contract, paymentMethod: "cash.someMeetup" }}
      />,
    );

    await act(async () => {
      await fireEvent.press(getByText("cancel trade"));
    });
    const { queryByText } = render(<GlobalPopup />);
    await waitFor(() => {
      jest.runAllTimers();
    });

    expect(queryByText("cancel trade")).toBeFalsy();
    expect(queryByText("trade canceled")).toBeTruthy();
    expect(
      queryByText(
        tolgee.t("contract.cancel.cash.tradeCanceled.text", {
          ns: "contract",
          contractId: contract.id,
          address: "custom payout address",
        }),
      ),
    ).toBeTruthy();
  });
});
