import { useShallow } from "zustand/shallow";
import { shouldShowBackupReminder } from "../store/settingsStore/helpers/shouldShowBackupReminder";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";

export const useShouldShowBackupReminder = () => {
  const [
    lastFileBackupDate,
    lastSeedBackupDate,
    showBackupReminder,
    setShowBackupReminder,
  ] = useSettingsStore(
    useShallow((state) => [
      state.lastFileBackupDate,
      state.lastSeedBackupDate,
      state.showBackupReminder,
      state.setShowBackupReminder,
    ]),
  );

  if (
    !showBackupReminder &&
    shouldShowBackupReminder(lastFileBackupDate, lastSeedBackupDate)
  ) {
    setShowBackupReminder(true);
  }
};
