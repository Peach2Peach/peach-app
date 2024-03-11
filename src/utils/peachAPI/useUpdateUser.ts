import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crypto } from "bitcoinjs-lib";
import OpenPGP from "react-native-fast-openpgp";
import { userKeys } from "../../hooks/query/useSelfUser";
import { peachAPI } from "./peachAPI";

export type UpdateUserParams = {
  pgp?: PGPKeychain;
  fcmToken?: string;
  referralCode?: string;
  feeRate?: FeeRate;
  feeRateLiquid?: FeeRate;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: userKeys.self() });
      const previousData = queryClient.getQueryData(userKeys.self());
      queryClient.setQueryData<User>(userKeys.self(), (old) => {
        if (!old) return undefined;
        return { ...old, ...variables };
      });
      return { previousData };
    },
    mutationFn: updateUser,
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(userKeys.self(), context?.previousData);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: userKeys.self() }),
  });
}

async function updateUser({
  pgp,
  fcmToken,
  referralCode,
  feeRate,
  feeRateLiquid,
}: UpdateUserParams) {
  const peachAccount = peachAPI.apiOptions.peachAccount;
  if (!peachAccount) throw new Error("UNAUTHORIZED");
  const { result, error } = await peachAPI.private.user.updateUser({
    ...(await getPGPUpdatePayload(pgp)),
    fcmToken,
    referralCode,
    feeRate,
    feeRateLiquid,
  });

  if (error || !result) throw new Error(error?.error || "UNKNOWN_ERROR");

  return result;
}

async function getPGPUpdatePayload(pgp?: PGPKeychain) {
  const peachAccount = peachAPI.apiOptions.peachAccount;
  if (!peachAccount || !pgp) return {};

  const message = `Peach new PGP key ${new Date().getTime()}`;
  const pgpSignature = await OpenPGP.sign(
    message,
    pgp.publicKey,
    pgp.privateKey,
    "",
  );

  return {
    publicKey: peachAccount.publicKey.toString("hex"),
    pgpPublicKey: pgp.publicKey,
    signature: peachAccount
      .sign(crypto.sha256(Buffer.from(pgp.publicKey)))
      .toString("hex"),
    message,
    pgpSignature,
  };
}
