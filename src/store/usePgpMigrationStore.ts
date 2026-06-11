import { create } from "zustand";

// "migrating": the one-time PGP key rotation is running — server data is being
// re-encrypted to the new key and the local key swapped, so the encrypted-data
// sync hooks must pause (avoid decrypting/validating/wiping with a mismatched
// key) and a blocking screen is shown.
// "success": rotation finished — a success screen with a "Proceed" button is
// shown until the user dismisses it.
export type PgpMigrationStatus = "idle" | "migrating" | "success";

type PgpMigrationStore = {
  status: PgpMigrationStatus;
  setStatus: (status: PgpMigrationStatus) => void;
};

export const usePgpMigrationStore = create<PgpMigrationStore>((set) => ({
  status: "idle",
  setStatus: (status) => set({ status }),
}));
