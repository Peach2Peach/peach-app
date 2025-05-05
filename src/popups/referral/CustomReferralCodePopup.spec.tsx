import { toMatchDiffSnapshot } from "snapshot-diff";
import { act, fireEvent, render, waitFor } from "test-utils";
import { getError, getResult } from "../../../peach-api/src/utils/result";
import { peachAPI } from "../../utils/peachAPI";
import { CustomReferralCodePopup } from "./CustomReferralCodePopup";
expect.extend({ toMatchDiffSnapshot });

const redeemReferralCodeMock = jest.spyOn(
  peachAPI.private.user,
  "redeemReferralCode",
);
const mockShowErrorBanner = jest.fn();
jest.mock("../../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowErrorBanner,
}));

jest.useFakeTimers();

describe("CustomReferralCodePopup", () => {
  it("updates referral code state", () => {
    const { getByPlaceholderText, toJSON } = render(
      <CustomReferralCodePopup />,
    );

    const withoutText = toJSON();
    fireEvent.changeText(getByPlaceholderText("creative thing here"), "HODL");
    const withText = toJSON();

    expect(withoutText).toMatchDiffSnapshot(withText);
  });
  it("submits custom referral code", async () => {
    redeemReferralCodeMock.mockResolvedValueOnce(
      getResult({ success: true, bonusPoints: 0 }),
    );
    const { getByText, getByPlaceholderText } = render(
      <CustomReferralCodePopup />,
    );

    fireEvent.changeText(getByPlaceholderText("creative thing here"), "HODL");
    fireEvent.press(getByText("set referral"));

    await waitFor(() => {
      expect(redeemReferralCodeMock).toHaveBeenCalledWith({ code: "HODL" });
    });
  });
  it("handles referral code exists error", async () => {
    redeemReferralCodeMock.mockResolvedValueOnce(
      getError({ error: "ALREADY_TAKEN" }),
    );
    const { getByText, getByPlaceholderText } = render(
      <CustomReferralCodePopup />,
    );

    fireEvent.changeText(getByPlaceholderText("creative thing here"), "HODL");
    act(() => {
      fireEvent.press(getByText("set referral"));
    });
    await waitFor(() => {
      expect(mockShowErrorBanner).toHaveBeenCalledWith("ALREADY_TAKEN");
    });
  });
  it("handles other API Errors", async () => {
    redeemReferralCodeMock.mockResolvedValueOnce(
      getError({ error: "NOT_ENOUGH_POINTS" }),
    );
    const { getByText, getByPlaceholderText } = render(
      <CustomReferralCodePopup />,
    );

    fireEvent.changeText(getByPlaceholderText("creative thing here"), "HODL");
    fireEvent.press(getByText("set referral"));

    await waitFor(() => {
      expect(mockShowErrorBanner).toHaveBeenCalledWith("NOT_ENOUGH_POINTS");
    });
  });
});
