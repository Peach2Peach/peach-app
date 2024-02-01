export const compatibilityCheck = (
  currentVersion: string,
  minVersion: string,
) => {
  const current = currentVersion.replace(/[^0-9.]/gu, "").split(".");
  const minimum = minVersion.replace(/[^0-9.]/gu, "").split(".");

  for (let i = 0; i < current.length; i++) {
    if (Number(current[i]) > Number(minimum[i])) {
      return true;
    } else if (Number(current[i]) < Number(minimum[i])) {
      return false;
    }
  }

  return true;
};
