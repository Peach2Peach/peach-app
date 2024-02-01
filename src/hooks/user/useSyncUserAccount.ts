import { publishPGPPublicKey } from "../../init/publishPGPPublicKey";
import { useAccountStore } from "../../utils/account/account";
import { useSelfUser } from "../query/useSelfUser";

const checkPGPSyncStatus = (account: Account, user: User) => {
  const localKeys = [account.pgp];
  const remoteKeys = user?.pgpPublicKeys || [];

  return {
    keysToPush: localKeys.filter(
      (l) => !remoteKeys.map((r) => r.publicKey).includes(l.publicKey),
    ),
  };
};
export const useSyncUserAccount = () => {
  const account = useAccountStore((state) => state.account);
  const { user } = useSelfUser();

  if (!user) return false;

  const { keysToPush } = checkPGPSyncStatus(account, user);

  if (keysToPush.length > 0) {
    keysToPush.forEach(publishPGPPublicKey);
    return true;
  }

  return false;
};
