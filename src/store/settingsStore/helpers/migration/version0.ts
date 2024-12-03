import { info } from "../../../../utils/log/info";
import { SettingsVersion1 } from "./version1";

export type SettingsVersion0 = SettingsVersion1;

export const shouldMigrateToVersion1 = (
  _persistedState: unknown,
  version: number,
): _persistedState is SettingsVersion0 => version < 1;

export const version0 = (migratedState: SettingsVersion0): SettingsVersion1 => {
  info("settingsStore - migrating from version 0");
  migratedState.lastFileBackupDate = migratedState.lastBackupDate;
  delete migratedState.lastBackupDate;
  return migratedState;
};
