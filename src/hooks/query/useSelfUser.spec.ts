import { renderHook, waitFor } from "test-utils";
import { defaultUser } from "../../../peach-api/src/testData/userData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { useSelfUser } from "./useSelfUser";

jest.useFakeTimers();

describe("useSelfUser", () => {
  afterEach(() => {
    queryClient.clear();
  });

  it("fetches user from API", async () => {
    const { result } = renderHook(useSelfUser);
    expect(result.current).toEqual({
      user: undefined,
      isLoading: true,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current).toEqual({
      user: defaultUser,
      isLoading: false,
    });
  });
});
