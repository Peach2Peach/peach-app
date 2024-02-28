import { useEffect } from "react";
import { useAccountStore } from "../../utils/account/account";
import { useUpdateUser } from "../../utils/peachAPI/useUpdateUser";
import { useSelfUser } from "../query/useSelfUser";

export const usePublishMissingPublicKey = () => {
  const pgp = useAccountStore((state) => state.account.pgp);
  const { user } = useSelfUser();
  const { mutate: updateUser } = useUpdateUser();
  useEffect(() => {
    if (!user) return;
    if (
      pgp.publicKey !== user.pgpPublicKey ||
      user.pgpPublicKeys.find((key) => key.publicKey === pgp.publicKey) ===
        undefined
    ) {
      updateUser({ pgp });
    }
  }, [pgp, updateUser, user]);
};
