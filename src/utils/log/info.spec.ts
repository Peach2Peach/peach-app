import crashlytics from "@react-native-firebase/crashlytics";
import { isProduction } from "../system/isProduction";

jest.mock("../system/isProduction", () => ({
  isProduction: jest.fn(),
}));

describe("info", () => {
  const info = jest.requireActual("./info").info;
  const infoSpy = jest.spyOn(console, "info");

  it("is logging info to console for dev environment", () => {
    (isProduction as jest.Mock).mockReturnValueOnce(false);

    info("Test");
    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining("INFO - Test"),
    );
    expect(crashlytics().log).not.toHaveBeenCalled();
  });
  it("is logging info to crashlytics for prod environment", () => {
    (isProduction as jest.Mock).mockReturnValueOnce(true);
    info("Test");
    expect(crashlytics().log).toHaveBeenCalledWith(
      expect.stringContaining("INFO - Test"),
    );
    expect(infoSpy).not.toHaveBeenCalled();
  });
});
