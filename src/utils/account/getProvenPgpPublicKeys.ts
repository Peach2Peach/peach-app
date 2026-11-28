import { isValidPeachUserSignature } from "./isValidPeachUserSignature";

/**
 * @description keeps only the PGP public keys the user proved they own: the
 * proof is the user's Peach ID signature over sha256(publicKey), made when the
 * key was registered. A key the server lists without a valid proof could have
 * been added by someone else, so it must not be trusted to verify anything.
 * The public key is checked exactly as received (no trimming or normalizing),
 * since that is the string that was signed.
 */
export const getProvenPgpPublicKeys = ({
  userId,
  pgpPublicKeys,
}: {
  /** the user's Peach ID public key (user id) */
  userId: string;
  pgpPublicKeys: PGPPublicKeyProofPair[];
}) =>
  pgpPublicKeys.filter(
    ({ publicKey, proof }) =>
      !!publicKey &&
      !!proof &&
      isValidPeachUserSignature(publicKey, userId, proof),
  );

type UserWithPgpKeys = { id: string; pgpPublicKeys: PGPPublicKeyProofPair[] };

/** same as getProvenPgpPublicKeys, for a user object */
export const getUserProvenPgpPublicKeys = (user: UserWithPgpKeys) =>
  getProvenPgpPublicKeys({
    userId: user.id,
    pgpPublicKeys: user.pgpPublicKeys,
  });

/**
 * @description the proven PGP public keys of every given user, joined for
 * signAndEncrypt. Throws NO_PROVEN_PGP_PUBLIC_KEY when a user has none, so
 * nothing gets encrypted that one of the parties could not read.
 */
export const getRecipientPgpPublicKeys = (users: UserWithPgpKeys[]) =>
  users
    .flatMap((user) => {
      const keys = getUserProvenPgpPublicKeys(user);
      if (keys.length === 0) throw new Error("NO_PROVEN_PGP_PUBLIC_KEY");
      return keys.map(({ publicKey }) => publicKey);
    })
    .join("\n");
