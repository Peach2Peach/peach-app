import { useEffect } from "react";
import { useAccountStore } from "../../utils/account/account";
import { useUpdateUser } from "../../utils/peachAPI/useUpdateUser";
import { useSelfUser } from "../query/useSelfUser";

export const usePublishMissingPublicKey = () => {
  const pgp = useAccountStore((state) => state.account.pgp);
  const { user } = useSelfUser();
  const { mutate: updateUser } = useUpdateUser();
  const publicKeys = user?.pgpPublicKeys;
  useEffect(() => {
    if (!publicKeys) return;
    if (
      publicKeys.findIndex(({ publicKey }) => publicKey === pgp.publicKey) ===
      -1
    ) {
      updateUser({ pgp });
    }
  }, [pgp, publicKeys, updateUser]);
};
