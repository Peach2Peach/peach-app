import { act, renderHook } from "test-utils";
import { recoveredAccount } from "../../../tests/unit/data/accountData";
import { useRecoverAccount } from "./useRecoverAccount";

const mockUserUpdate = jest.fn();

jest.mock("../../init/useUserUpdate", () => ({
  useUserUpdate: () => mockUserUpdate,
}));

jest.useFakeTimers();

describe("useRecoverAccount", () => {
  it("calls user update", async () => {
    const { result } = renderHook(useRecoverAccount);
    await act(async () => {
      await result.current(recoveredAccount);
    });
    expect(mockUserUpdate).toHaveBeenCalled();
  });
});
