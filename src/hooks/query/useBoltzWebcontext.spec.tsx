import { renderHook, waitFor } from "test-utils";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { useBoltzWebcontext } from "./useBoltzWebcontext";

jest.useFakeTimers();

describe("useBoltzWebcontext", () => {
  const html = "<html>";
  const mockFetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      text: () => Promise.resolve(html),
    }),
  );
  global.fetch = mockFetch;
  afterEach(() => {
    queryClient.clear();
  });
  it("fetches html from API", async () => {
    const { result } = renderHook(useBoltzWebcontext);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(html);
  });
});
