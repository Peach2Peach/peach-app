import { buildReportMessage } from "./buildReportMessage";

describe("buildReportMessage", () => {
  it("returns a message for report", () => {
    const message = buildReportMessage({
      message: "test",
      shareDeviceID: false,
      shareLogs: false,
    });
    const expectedMessage = "test\n\nApp version: 0.2.0 (undefined)";
    expect(message).toBe(expectedMessage);
  });
  it("returns a message for report with device id and log sharing", () => {
    const message = buildReportMessage({
      message: "test",
      shareDeviceID: true,
      shareLogs: true,
    });
    const expectedMessage =
      "test\n\nDevice ID Hash: f04f9393408f65cc9cfa89aa5cf642cbcdd0a29b69ed9c099daa2c27178ed827\n\nApp version: 0.2.0 (undefined)\n\nUser shared app logs, please check crashlytics";
    expect(message).toBe(expectedMessage);
  });
});
