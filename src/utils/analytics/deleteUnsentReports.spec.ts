import { deleteUnsentReports } from "./deleteUnsentReports";
import crashlytics from "@react-native-firebase/crashlytics";

describe("deleteUnsentReports function", () => {
  it("should call the deleteUnsentReports method of the Crashlytics module", () => {
    deleteUnsentReports();
    expect(crashlytics().deleteUnsentReports).toHaveBeenCalledTimes(1);
  });
});
