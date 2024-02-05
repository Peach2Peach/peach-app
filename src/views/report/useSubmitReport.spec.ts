import { renderHook, waitFor } from "test-utils";
import { sendErrors } from "../../utils/analytics/sendErrors";
import { peachAPI } from "../../utils/peachAPI";
import { useSubmitReport } from "./useSubmitReport";

jest.mock("../../utils/analytics/sendErrors", () => ({
  sendErrors: jest.fn(),
}));
const sendReportSpy = jest.spyOn(peachAPI.public.contact, "sendReport");

jest.useFakeTimers();

describe("useSubmitReport", () => {
  const email = "adam@back.space";
  const reason = "Feature request";
  const topic = "I have an idea";
  const message = "it will blow your socks off!";

  it("returns a message for report", async () => {
    const { result } = renderHook(useSubmitReport);
    result.current.mutate({
      email,
      reason,
      topic,
      message,
      shareDeviceID: false,
      shareLogs: false,
    });
    await waitFor(() => {
      expect(sendReportSpy).toHaveBeenCalledWith({
        email,
        reason,
        topic,
        message:
          "it will blow your socks off!\n\nApp version: 0.2.0 (undefined)",
      });
    });
    expect(result.current.isSuccess).toBe(true);
  });
  it("does not send error report if logs are not intended to be shared", async () => {
    const { result } = renderHook(useSubmitReport);

    result.current.mutate({
      email,
      reason,
      topic,
      message,
      shareDeviceID: false,
      shareLogs: false,
    });
    await waitFor(() => {
      expect(sendErrors).not.toHaveBeenCalled();
    });
  });
  it("does send error report if logs are intended to be shared", async () => {
    const { result } = renderHook(useSubmitReport);
    result.current.mutate({
      email,
      reason,
      topic,
      message,
      shareDeviceID: false,
      shareLogs: true,
    });
    await waitFor(() => {
      expect(sendErrors).toHaveBeenCalledWith([
        new Error(
          "user shared app logs: I have an idea - it will blow your socks off!\n\nApp version: 0.2.0 (undefined)\n\nUser shared app logs, please check crashlytics",
        ),
      ]);
    });
  });
});
