import { account1 } from "../../tests/unit/data/accountData";
import { setAccount } from "../utils/account/account";
import { getError } from "../utils/result/getError";
import { publishPGPPublicKey } from "./publishPGPPublicKey";

const updateUserMock = jest.fn().mockResolvedValue([{ success: true }, null]);
jest.mock("../utils/peachAPI/updateUser", () => ({
  updateUser: (...args: unknown[]) => updateUserMock(...args),
}));
describe("publishPGPPublicKey", () => {
  it("does send pgp key to server", async () => {
    await publishPGPPublicKey(account1.pgp);
    expect(updateUserMock).toHaveBeenCalledWith({ pgp: account1.pgp });
  });
  it("should handle updateUser errors", async () => {
    updateUserMock.mockResolvedValue(getError({ error: "error" }));
    await publishPGPPublicKey(account1.pgp);
    expect(updateUserMock).toHaveBeenCalledWith({ pgp: account1.pgp });
  });
  it("should catch errors", async () => {
    setAccount(account1);

    updateUserMock.mockRejectedValue(new Error("error"));
    await publishPGPPublicKey(account1.pgp);
    expect(updateUserMock).toHaveBeenCalledWith({ pgp: account1.pgp });
  });
});
