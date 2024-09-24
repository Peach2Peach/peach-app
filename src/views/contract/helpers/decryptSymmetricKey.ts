import { decrypt } from "../../../utils/pgp/decrypt";

export const decryptSymmetricKey = async (symmetricKeyEncrypted: string) => {
  try {
    const symmetricKey = await decrypt(symmetricKeyEncrypted);
    return symmetricKey;
  } catch (err) {
    return null;
  }
};
