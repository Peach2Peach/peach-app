import crashlytics from "@react-native-firebase/crashlytics";
import { deleteUnsentReports } from "./deleteUnsentReports";

describe("deleteUnsentReports function", () => {
  it("should call the deleteUnsentReports method of the Crashlytics module", async () => {
    await deleteUnsentReports();
    expect(crashlytics().deleteUnsentReports).toHaveBeenCalledTimes(1);
  });
});
