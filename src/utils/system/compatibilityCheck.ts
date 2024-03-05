export const compatibilityCheck = (
  currentVersion: string,
  minVersion: string,
) => {
  const [currentVersionNumber, currentBuildNumber] = currentVersion.split(" ");
  const [minVersionNumber, minBuildNumber] = minVersion.split(" ");

  const currentStrings = currentVersionNumber.split(".");
  const [currentMajor, currentMinor, currentPatch] = currentStrings.map((s) =>
    parseInt(s, 10),
  );
  const minStrings = minVersionNumber.split(".");
  const [minMajor, minMinor, minPatch] = minStrings.map((s) => parseInt(s, 10));

  if (currentMajor < minMajor) return false;
  if (currentMajor === minMajor && currentMinor < minMinor) return false;
  if (
    currentMajor === minMajor &&
    currentMinor === minMinor &&
    currentPatch < minPatch
  )
    return false;

  if (
    minBuildNumber &&
    currentBuildNumber &&
    currentBuildNumber < minBuildNumber
  )
    return false;

  return true;
};
