import { renderHook } from "test-utils";
import { defaultUser } from "../../../peach-api/src/testData/userData";
import { account1 } from "../../../tests/unit/data/accountData";
import { useAccountStore } from "../../utils/account/account";
import { useSyncUserAccount } from "./useSyncUserAccount";

const publishPGPPublicKeyMock = jest.fn();
jest.mock("../../init/publishPGPPublicKey", () => ({
  publishPGPPublicKey: (...args: unknown[]) => publishPGPPublicKeyMock(...args),
}));
const useSelfUserMock = jest.fn().mockReturnValue({ user: undefined });
jest.mock("../query/useSelfUser", () => ({
  useSelfUser: (...args: unknown[]) => useSelfUserMock(...args),
}));
describe("useSyncUserAccount", () => {
  beforeAll(() => {
    useAccountStore.getState().setAccount(account1);
  });
  it("should not do anything if self user is not fetched", () => {
    const { result } = renderHook(useSyncUserAccount);
    expect(result.current).toBeFalsy();
    expect(publishPGPPublicKeyMock).not.toHaveBeenCalled();
  });
  it("should not do anything if local key is already published", () => {
    useSelfUserMock.mockReturnValue({
      user: { ...defaultUser, pgpPublicKeys: [account1.pgp] },
    });
    const { result } = renderHook(useSyncUserAccount);
    expect(result.current).toBeFalsy();
    expect(publishPGPPublicKeyMock).not.toHaveBeenCalled();
  });
  it("should send unpublished keys to server", () => {
    useSelfUserMock.mockReturnValue({
      user: { ...defaultUser, pgpPublicKeys: [{ publicKey: "differentKey" }] },
    });
    const { result } = renderHook(useSyncUserAccount);
    expect(result.current).toBeTruthy();
    expect(publishPGPPublicKeyMock).toHaveBeenCalledWith(account1.pgp, 0, [
      account1.pgp,
    ]);
  });
});
