import { act, fireEvent, render } from "test-utils";
import { buyOffer } from "../../../../tests/unit/data/offerData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { peachAPI } from "../../../utils/peachAPI";
import { matchesKeys } from "../../../views/search/hooks/useOfferMatches";
import { GlobalPopup } from "../../popup/GlobalPopup";
import { TIMER_DURATION } from "./UndoButton";
import { UnmatchButton } from "./UnmatchButton";
import { tolgee } from "../../../tolgee";

jest.useFakeTimers();

const unmatchOfferMock = jest.spyOn(peachAPI.private.offer, "unmatchOffer");

describe("UnmatchButton", () => {
  const interruptMatching = jest.fn();
  const setShowMatchedCard = jest.fn();
  const MIN_AMOUNT = 21000;
  const MAX_AMOUNT = 210000;
  const defaultProps = {
    match: {
      matched: true,
      offerId: "offerId",
    },
    offer: {
      ...buyOffer,
      id: "offerId",
      type: "bid",
      amount: [MIN_AMOUNT, MAX_AMOUNT],
      creationDate: new Date("2021-01-01"),
      meansOfPayment: { EUR: ["sepa"] },
      paymentData: {
        sepa: { hashes: ["fakeHash"] },
      },
      releaseAddress: "releaseAddress",
      online: true,
      matches: [],
      doubleMatched: false,
      tradeStatus: "searchingForPeer",
    } satisfies BuyOffer | SellOffer,
    interruptMatching,
    setShowMatchedCard,
  };

  beforeEach(() => {
    queryClient.setQueryData(matchesKeys.matchDetail("offerId", "offerId"), {
      matched: true,
    });
  });
  it("renders correctly", () => {
    const { toJSON } = render(<UnmatchButton {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should show the undo button if not yet matched", () => {
    const { toJSON } = render(
      <UnmatchButton
        {...defaultProps}
        match={{ ...defaultProps.match, matched: false }}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should show the unmatch button again after the timer is over", async () => {
    const { getByText } = render(
      <UnmatchButton
        {...defaultProps}
        match={{ ...defaultProps.match, matched: false }}
      />,
    );
    await act(() => {
      jest.advanceTimersByTime(TIMER_DURATION);
    });
    expect(
      getByText(tolgee.t("search.unmatch", { ns: "unassigned" })),
    ).toBeTruthy();
  });
  it("should show the unmatch popup when unmatch is pressed", async () => {
    const { getByText } = render(
      <>
        <UnmatchButton {...defaultProps} />
        <GlobalPopup />
      </>,
    );

    await act(() => {
      fireEvent.press(
        getByText(tolgee.t("search.unmatch", { ns: "unassigned" })),
      );
    });

    expect(
      getByText(tolgee.t("search.popups.unmatch.title", { ns: "unassigned" })),
    ).toBeTruthy();
  });
  it("should close the popup when action1 is pressed", async () => {
    const { getByText, queryByText } = render(
      <>
        <UnmatchButton {...defaultProps} />
        <GlobalPopup />
      </>,
    );

    await act(() => {
      fireEvent.press(
        getByText(tolgee.t("search.unmatch", { ns: "unassigned" })),
      );
    });

    await act(() => {
      const neverMind = getByText(
        tolgee.t("search.popups.unmatch.neverMind", { ns: "unassigned" }),
      );
      fireEvent.press(neverMind);
    });

    expect(
      queryByText(
        tolgee.t("search.popups.unmatch.title", { ns: "unassigned" }),
      ),
    ).toBeFalsy();
    expect(setShowMatchedCard).not.toHaveBeenCalled();
  });
  it("should unmatch and show confirmation popup when action2 is pressed", async () => {
    const { getByText } = render(
      <>
        <UnmatchButton {...defaultProps} />
        <GlobalPopup />
      </>,
    );

    await act(() => {
      fireEvent.press(
        getByText(tolgee.t("search.unmatch", { ns: "unassigned" })),
      );
    });

    await act(() => {
      fireEvent.press(
        getByText(
          tolgee.t("search.popups.unmatch.confirm", { ns: "unassigned" }),
        ),
      );
    });

    expect(
      getByText(tolgee.t("search.popups.unmatched", { ns: "unassigned" })),
    ).toBeTruthy();
    expect(setShowMatchedCard).toHaveBeenCalled();
    expect(unmatchOfferMock).toHaveBeenCalledWith({
      offerId: "offerId",
      matchingOfferId: "offerId",
    });
    expect(
      queryClient.getQueryData(matchesKeys.matchDetail("offerId", "offerId")),
    ).toStrictEqual({
      matched: false,
    });
  });

  it("should call interruptMatching when undo is pressed", async () => {
    const { getAllByText } = render(
      <UnmatchButton
        {...defaultProps}
        match={{ ...defaultProps.match, matched: false }}
      />,
    );

    await act(() => {
      fireEvent.press(
        getAllByText(tolgee.t("search.undo", { ns: "unassigned" }))[0],
      );
    });

    expect(interruptMatching).toHaveBeenCalled();
  });
  it("show the match undone popup when undo is pressed", async () => {
    const { getAllByText, getByText } = render(
      <>
        <UnmatchButton
          {...defaultProps}
          match={{ ...defaultProps.match, matched: false }}
        />
        ,
        <GlobalPopup />
      </>,
    );

    await act(() => {
      fireEvent.press(getAllByText("undo")[0]);
    });

    expect(getByText("match undone")).toBeTruthy();
  });
});
