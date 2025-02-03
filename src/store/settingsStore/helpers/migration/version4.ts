import { SettingsVersion4 } from "./migrateSettings";

const VERSION_THRESHOLD = 5;
export const shouldMigrateToVersion5 = (
  _persistedState: unknown,
  version: number,
): _persistedState is SettingsVersion4 => version < VERSION_THRESHOLD;

export const version4 = (migratedState: SettingsVersion4) => ({
  ...migratedState,
  enableAnalytics: false,
  analyticsPopupSeen: false,
});
