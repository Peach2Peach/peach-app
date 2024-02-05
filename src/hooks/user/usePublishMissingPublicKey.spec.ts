import { renderHook } from "test-utils";
import { defaultUser } from "../../../peach-api/src/testData/userData";
import { account1 } from "../../../tests/unit/data/accountData";
import { useAccountStore } from "../../utils/account/account";
import { usePublishMissingPublicKey } from "./usePublishMissingPublicKey";

const mockPublishPGPPublicKey = jest.fn();
jest.mock("../../utils/peachAPI/useUpdateUser", () => ({
  useUpdateUser: () => ({ mutate: mockPublishPGPPublicKey }),
}));

jest.mock("../query/useSelfUser");
const useSelfUserMock = jest
  .requireMock("../query/useSelfUser")
  .useSelfUser.mockReturnValue({ user: undefined });

jest.useFakeTimers();
describe("usePublishMissingPublicKey", () => {
  beforeAll(() => {
    useAccountStore.getState().setAccount(account1);
  });
  it("should not do anything if self user is not fetched", () => {
    renderHook(usePublishMissingPublicKey);
    expect(mockPublishPGPPublicKey).not.toHaveBeenCalled();
  });
  it("should not do anything if local key is already published", () => {
    useSelfUserMock.mockReturnValue({
      user: { ...defaultUser, pgpPublicKeys: [account1.pgp] },
    });
    renderHook(usePublishMissingPublicKey);
    expect(mockPublishPGPPublicKey).not.toHaveBeenCalled();
  });
  it("should send unpublished keys to server", () => {
    useSelfUserMock.mockReturnValue({
      user: { ...defaultUser, pgpPublicKeys: [{ publicKey: "differentKey" }] },
    });
    renderHook(usePublishMissingPublicKey);
    expect(mockPublishPGPPublicKey).toHaveBeenCalledTimes(1);
    expect(mockPublishPGPPublicKey).toHaveBeenCalledWith({ pgp: account1.pgp });
  });
});
