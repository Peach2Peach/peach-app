import { renderHook, waitFor } from "test-utils";
import { sendErrors } from "../../utils/analytics/sendErrors";
import { peachAPI } from "../../utils/peachAPI";
import { useSendReport } from "./useSendReport";

jest.mock("../../utils/analytics/sendErrors", () => ({
  sendErrors: jest.fn(),
}));

jest.mock("../../constants", () => ({
  SESSION_ID: "SESSION_ID",
  APPVERSION: "1.0.0",
  BUILDNUMBER: "999",
  UNIQUEID: "UNIQUEID",
}));
const sendReportSpy = jest.spyOn(peachAPI.public.contact, "sendReport");

jest.useFakeTimers();

describe("useSendReport", () => {
  const email = "adam@back.space";
  const reason = "Feature request";
  const topic = "I have an idea";
  const message = "it will blow your socks off!";

  it("returns a message for report", async () => {
    const { result } = renderHook(useSendReport);
    result.current.mutate({
      email,
      reason,
      topic,
      message,
    });
    await waitFor(() => {
      expect(sendReportSpy).toHaveBeenCalledWith({
        email,
        reason,
        topic,
        message:
          "it will blow your socks off!\n\nUser ID: No public key available\n\nDevice ID Hash: UNIQUEID\n\nApp version: 1.0.0 (999)\n\nUser shared app logs, please check crashlytics\nSession ID: SESSION_ID",
      });
    });
    expect(result.current.isSuccess).toBe(true);
    await waitFor(() => {
      expect(sendErrors).toHaveBeenCalledWith([
        new Error(
          "user shared app logs: I have an idea - it will blow your socks off!\n\nUser ID: No public key available\n\nDevice ID Hash: UNIQUEID\n\nApp version: 1.0.0 (999)\n\nUser shared app logs, please check crashlytics\nSession ID: SESSION_ID",
        ),
      ]);
    });
  });
});
