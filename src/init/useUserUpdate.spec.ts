import { renderHook } from "test-utils";
import { account1 } from "../../tests/unit/data/accountData";
import { defaultAccount, setAccount } from "../utils/account/account";
import { useUserUpdate } from "./useUserUpdate";

jest.mock("@react-native-firebase/messaging", () => ({
  __esModule: true,
  default: () => ({
    getToken: jest.fn(),
  }),
}));

const mockUpdateUser = jest.fn();
jest.mock("../utils/peachAPI/useUpdateUser", () => ({
  useUpdateUser: () => ({ mutate: mockUpdateUser }),
}));
jest.useFakeTimers();

describe("useUserUpdate", () => {
  const referralCode = "referralCode";
  afterEach(() => {
    setAccount(defaultAccount);
  });

  it("sends updates to server", async () => {
    const newToken = "otherToken";
    setAccount(account1);
    const getTokenMock = jest.fn().mockResolvedValue(newToken);
    jest
      .spyOn(jest.requireMock("@react-native-firebase/messaging"), "default")
      .mockReturnValue({
        getToken: getTokenMock,
      });
    const { result } = renderHook(useUserUpdate);
    await result.current(referralCode);
    expect(getTokenMock).toHaveBeenCalled();
    expect(mockUpdateUser).toHaveBeenCalledWith(
      {
        referralCode,
        fcmToken: newToken,
      },
      {
        onError: expect.any(Function),
        onSuccess: expect.any(Function),
      },
    );
  });
});
