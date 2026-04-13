import { useEffect } from "react";
import { useAccountStore } from "../utils/account/account";
import { useUpdateUser } from "../utils/peachAPI/useUpdateUser";
import { useSelfUser } from "./query/useSelfUser";

export const useRegisterPGP = () => {
  const pgp = useAccountStore((state) => state.account.pgp);
  const { user } = useSelfUser();
  const { mutate: updateUser } = useUpdateUser();

  useEffect(() => {
    if (!user || !pgp.publicKey) return;
    if (
      pgp.publicKey !== user.pgpPublicKey ||
      !user.pgpPublicKeys.find((key) => key.publicKey === pgp.publicKey)
    ) {
      updateUser({ pgp });
    }
  }, [user, pgp, updateUser]);
};
