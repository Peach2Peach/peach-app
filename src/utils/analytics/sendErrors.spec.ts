import crashlytics from "@react-native-firebase/crashlytics";
import * as DeviceInfo from "react-native-device-info";
import { sendErrors } from "./sendErrors";

const appendFileMock = jest.fn();
jest.mock("../file/appendFile", () => ({
  appendFile: (...args: unknown[]) => appendFileMock(...args),
}));

describe("sendErrors function", () => {
  const isAirplaneModeSync = jest.spyOn(DeviceInfo, "isAirplaneModeSync");
  it("should append the error messages to a file when airplane mode is enabled", async () => {
    isAirplaneModeSync.mockReturnValueOnce(true);
    const errors = [new Error("error 1"), new Error("error 2")];

    await sendErrors(errors);

    expect(appendFileMock).toHaveBeenCalledWith(
      "/error.log",
      "error 1\nerror 2",
      true,
    );
    expect(crashlytics().recordError).not.toHaveBeenCalled();
  });

  it("should send crash reports to Crashlytics when airplane mode is not enabled", async () => {
    isAirplaneModeSync.mockReturnValueOnce(false);
    const errors = [new Error("error 1"), new Error("error 2")];

    await sendErrors(errors);

    expect(appendFileMock.mock.calls.length).toBe(0);
    expect(crashlytics().recordError).toHaveBeenCalledTimes(2);
    expect(crashlytics().recordError).toHaveBeenCalledWith(errors[0]);
    expect(crashlytics().recordError).toHaveBeenCalledWith(errors[1]);
  });
});
