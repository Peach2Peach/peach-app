import { renderHook, responseUtils, waitFor } from "test-utils";
import { defaultUser } from "../../../peach-api/src/testData/userData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { peachAPI } from "../../utils/peachAPI";
import { userKeys } from "../query/useSelfUser";
import { useToggleBatching } from "./useToggleBatching";

const showErrorBannerMock = jest.fn();
jest.mock("../../hooks/useShowErrorBanner");
jest
  .requireMock("../../hooks/useShowErrorBanner")
  .useShowErrorBanner.mockReturnValue(showErrorBannerMock);

const setBatchingMock = jest.spyOn(
  peachAPI.private.user,
  "enableTransactionBatching",
);

jest.useFakeTimers();

describe("useToggleBatching", () => {
  beforeEach(() => {
    queryClient.setQueryData(userKeys.self(), defaultUser);
  });
  it("should call setBatching with inverted boolean", async () => {
    const { result } = renderHook(() => useToggleBatching(defaultUser));
    await result.current.mutate();

    await waitFor(() => {
      expect(queryClient.getQueryData<User>(userKeys.self())).toEqual({
        ...defaultUser,
        isBatchingEnabled: !defaultUser.isBatchingEnabled,
      });
    });
    await waitFor(() => {
      expect(setBatchingMock).toHaveBeenCalledWith({
        enableBatching: !defaultUser.isBatchingEnabled,
        riskAcknowledged: true,
      });
    });
  });

  it("should call showErrorBanner on error", async () => {
    setBatchingMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    const { result } = renderHook(() => useToggleBatching(defaultUser));
    result.current.mutate();

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith("UNAUTHORIZED");
    });
  });
});
