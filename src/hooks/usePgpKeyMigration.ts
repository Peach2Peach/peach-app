import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { usePgpMigrationStore } from "../store/usePgpMigrationStore";
import { useAccountStore } from "../utils/account/account";
import { deriveDeterministicPgp } from "../utils/account/deriveDeterministicPgp";
import { storeIdentity } from "../utils/account/storeAccount/storeIdentity";
import { error } from "../utils/log/error";
import { info } from "../utils/log/info";
import { performPgpKeyMigration } from "../utils/pgp/performPgpKeyMigration";
import { userKeys, useSelfUser } from "./query/useSelfUser";

const updateLocalPgp = async (newPgp: PGPKeychain) => {
  const account = useAccountStore.getState().account;
  const updated = { ...account, pgp: newPgp };
  useAccountStore.getState().setAccount(updated);
  await storeIdentity(updated);
};

/**
 * @description One-time, on-startup check that the user's dominant PGP key is the
 * seed-derived (deterministic) one. If the server already holds it, the local key
 * is updated to match (req 1). Otherwise — provided the local key still matches
 * the server's old key, so we can decrypt — it runs the data-preserving rotation
 * and then swaps the local key. A key desync (local ≠ server old, server ≠
 * deterministic) is left as-is to retry on a later startup.
 *
 * Must run AFTER the encrypted-data sync hooks; while migrating, `isMigrating`
 * pauses them so they never decrypt/validate/wipe against a mismatched key.
 */
export const usePgpKeyMigration = () => {
  const account = useAccountStore((state) => state.account);
  const { user } = useSelfUser();
  const setStatus = usePgpMigrationStore((state) => state.setStatus);
  const queryClient = useQueryClient();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    const { mnemonic } = account;
    const localPublicKey = account.pgp.publicKey;
    if (!user || !mnemonic || !localPublicKey) return;

    let deterministic: PGPKeychain;
    try {
      deterministic = deriveDeterministicPgp(mnemonic);
    } catch (e) {
      error("[pgpMigration] failed to derive deterministic pgp", e);
      return;
    }

    const serverDominant = user.pgpPublicKeys?.[0]?.publicKey;

    // Server already holds the deterministic key.
    if (serverDominant === deterministic.publicKey) {
      if (localPublicKey !== deterministic.publicKey) {
        hasRun.current = true;
        info("[pgpMigration] updating local key to deterministic (server ok)");
        void updateLocalPgp(deterministic);
      }
      return;
    }

    // Server holds an old/random key. Only migrate if our local key matches it,
    // i.e. we hold the private key needed to decrypt the server's blobs.
    if (localPublicKey !== serverDominant) return;

    hasRun.current = true;
    void (async () => {
      setStatus("migrating");
      try {
        const result = await performPgpKeyMigration({
          newPgp: deterministic,
          oldPrivateKey: account.pgp.privateKey,
        });
        if (result.status === "migrated") {
          await updateLocalPgp(deterministic);
          await queryClient.invalidateQueries({ queryKey: userKeys.self() });
          info("[pgpMigration] migration complete");
          setStatus("success");
        } else {
          if (result.status === "error") {
            error("[pgpMigration] migration failed", result.error);
          }
          setStatus("idle");
        }
      } catch (e) {
        error("[pgpMigration] migration threw", e);
        setStatus("idle");
      }
    })();
  }, [user, account, setStatus, queryClient]);
};
