import { SettingsStore } from "../../useSettingsStore";

const VERSION_THRESHOLD = 6;
export const shouldMigrateToVersion6 = (
  _persistedState: unknown,
  version: number,
): _persistedState is SettingsStore => version < VERSION_THRESHOLD;

/** sell offers always refund into the Peach Wallet now, so a stored external
 * refund wallet choice is dropped */
export const version5 = (migratedState: SettingsStore) => ({
  ...migratedState,
  refundToPeachWallet: true,
});
