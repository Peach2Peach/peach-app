import { toMatchDiffSnapshot } from "snapshot-diff";
import { act, fireEvent, render, responseUtils } from "test-utils";
import { replaceMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { peachAPI } from "../../utils/peachAPI";
import { CustomReferralCodePopup } from "./CustomReferralCodePopup";
expect.extend({ toMatchDiffSnapshot });

const redeemReferralCodeMock = jest.spyOn(
  peachAPI.private.user,
  "redeemReferralCode",
);
const showErrorBannerMock = jest.fn();
jest.mock("../../hooks/useShowErrorBanner");
jest
  .requireMock("../../hooks/useShowErrorBanner")
  .useShowErrorBanner.mockReturnValue(showErrorBannerMock);

describe("useSetCustomReferralCodePopup", () => {
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
    redeemReferralCodeMock.mockResolvedValueOnce({
      result: { success: true, bonusPoints: 0 },
      ...responseUtils,
    });
    const { getByText, getByPlaceholderText } = render(
      <CustomReferralCodePopup />,
    );

    fireEvent.changeText(getByPlaceholderText("creative thing here"), "HODL");
    await fireEvent.press(getByText("set referral"));

    expect(redeemReferralCodeMock).toHaveBeenCalledWith({ code: "HODL" });
    expect(replaceMock).toHaveBeenCalledWith("referrals");
  });
  it("handles referral code exists error", async () => {
    redeemReferralCodeMock.mockResolvedValueOnce({
      error: {
        error: "ALREADY_TAKEN",
      },
      ...responseUtils,
    });
    const { getByText, getByPlaceholderText, toJSON } = render(
      <CustomReferralCodePopup />,
    );

    fireEvent.changeText(getByPlaceholderText("creative thing here"), "HODL");
    const withoutError = toJSON();
    await act(async () => {
      await fireEvent.press(getByText("set referral"));
    });
    const withError = toJSON();

    expect(withoutError).toMatchDiffSnapshot(withError);
  });
  it("handles other API Errors", async () => {
    redeemReferralCodeMock.mockResolvedValueOnce({
      error: {
        error: "NOT_ENOUGH_POINTS",
      },
      ...responseUtils,
    });
    const { getByText, getByPlaceholderText } = render(
      <CustomReferralCodePopup />,
    );

    fireEvent.changeText(getByPlaceholderText("creative thing here"), "HODL");
    await fireEvent.press(getByText("set referral"));

    expect(showErrorBannerMock).toHaveBeenCalledWith("NOT_ENOUGH_POINTS");
  });
});
