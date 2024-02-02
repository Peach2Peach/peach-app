import { renderHook } from "test-utils";
import { defaultUser } from "../../../peach-api/src/testData/userData";
import { account1 } from "../../../tests/unit/data/accountData";
import { useAccountStore } from "../../utils/account/account";
import { useSyncUserAccount } from "./useSyncUserAccount";

jest.mock("../../init/publishPGPPublicKey");
const publishPGPPublicKeyMock = jest.requireMock(
  "../../init/publishPGPPublicKey",
).publishPGPPublicKey;
jest.mock("../query/useSelfUser");
const useSelfUserMock = jest
  .requireMock("../query/useSelfUser")
  .useSelfUser.mockReturnValue({ user: undefined });
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
