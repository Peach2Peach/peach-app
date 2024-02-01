import { act, fireEvent, render } from "test-utils";
import { buyOffer } from "../../../../tests/unit/data/offerData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import i18n from "../../../utils/i18n";
import { peachAPI } from "../../../utils/peachAPI";
import { Popup } from "../../popup/Popup";
import { TIMER_DURATION } from "./UndoButton";
import { UnmatchButton } from "./UnmatchButton";

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
    queryClient.setQueryData(["matchDetails", "offerId", "offerId"], {
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
    expect(getByText(i18n("search.unmatch"))).toBeTruthy();
  });
  it("should show the unmatch popup when unmatch is pressed", async () => {
    const { getByText } = render(
      <>
        <UnmatchButton {...defaultProps} />
        <Popup />
      </>,
    );

    await act(() => {
      fireEvent.press(getByText(i18n("search.unmatch")));
    });

    expect(getByText(i18n("search.popups.unmatch.title"))).toBeTruthy();
  });
  it("should close the popup when action1 is pressed", async () => {
    const { getByText, queryByText } = render(
      <>
        <UnmatchButton {...defaultProps} />
        <Popup />
      </>,
    );

    await act(() => {
      fireEvent.press(getByText(i18n("search.unmatch")));
    });

    await act(() => {
      const neverMind = getByText(i18n("search.popups.unmatch.neverMind"));
      fireEvent.press(neverMind);
    });

    expect(queryByText(i18n("search.popups.unmatch.title"))).toBeFalsy();
    expect(setShowMatchedCard).not.toHaveBeenCalled();
  });
  it("should unmatch and show confirmation popup when action2 is pressed", async () => {
    const { getByText } = render(
      <>
        <UnmatchButton {...defaultProps} />
        <Popup />
      </>,
    );

    await act(() => {
      fireEvent.press(getByText(i18n("search.unmatch")));
    });

    await act(() => {
      fireEvent.press(getByText(i18n("search.popups.unmatch.confirm")));
    });

    expect(getByText(i18n("search.popups.unmatched"))).toBeTruthy();
    expect(setShowMatchedCard).toHaveBeenCalled();
    expect(unmatchOfferMock).toHaveBeenCalledWith({
      offerId: "offerId",
      matchingOfferId: "offerId",
    });
    expect(
      queryClient.getQueryData(["matchDetails", "offerId", "offerId"]),
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
      fireEvent.press(getAllByText(i18n("search.undo"))[0]);
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
        <Popup />
      </>,
    );

    await act(() => {
      fireEvent.press(getAllByText("undo")[0]);
    });

    expect(getByText("match undone")).toBeTruthy();
  });
});
