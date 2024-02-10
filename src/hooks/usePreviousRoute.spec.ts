import { renderHook } from "test-utils";
import { getStateMock } from "../../tests/unit/helpers/NavigationWrapper";
import { usePreviousRoute } from "./usePreviousRoute";

describe("usePreviousRoute", () => {
  getStateMock.mockReturnValue({
    routes: [
      { name: "aboutPeach", key: "First" },
      { name: "addressChecker", key: "Second" },
      { name: "backups", key: "Third" },
    ],
    routeNames: ["aboutPeach", "addressChecker", "backups"],
    key: "key",
    index: 2,
    type: "stack",
    stale: false,
  });
  it("should return the name of the previous route", () => {
    const { result } = renderHook(usePreviousRoute);
    expect(result.current).toEqual({ name: "addressChecker", key: "Second" });
  });
});
