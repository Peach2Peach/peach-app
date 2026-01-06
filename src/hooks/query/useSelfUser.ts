import { useQuery } from "@tanstack/react-query";
import { useAccountStore } from "../../utils/account/account";
import { peachAPI } from "../../utils/peachAPI";
import { useUpdateUser } from "../../utils/peachAPI/useUpdateUser";

export const userKeys = {
  all: ["user"] as const,
  user: (id: string) => [...userKeys.all, id] as const,
  userStatus: (id: string) => [...userKeys.user(id), "status"] as const,
  userOffers: (id: string) => [...userKeys.user(id), "offers"] as const,
  self: () => [...userKeys.all, "self"] as const,
  tradingLimits: () => [...userKeys.self(), "tradingLimits"] as const,
};

export const useSelfUser = () => {
  const pgp = useAccountStore((state) => state.account.pgp);
  const { mutate: updateUser } = useUpdateUser();
  const { data, isLoading } = useQuery({
    queryKey: userKeys.self(),
    queryFn: async () => {
      const user = await getUserQuery();
      if (!user) return undefined;
      if (
        pgp.publicKey &&
        (pgp.publicKey !== user.pgpPublicKey ||
          !user.pgpPublicKeys.find((key) => key.publicKey === pgp.publicKey))
      ) {
        updateUser({ pgp });
      }
      return user;
    },
  });
  return { user: data, isLoading };
};

async function getUserQuery() {
  const { result, error } = await peachAPI.private.user.getSelfUser();

  if (error) throw new Error(error.message);
  return result;
}
