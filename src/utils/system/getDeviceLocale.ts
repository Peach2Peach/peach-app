export const getDeviceLocale = () =>
  Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0];
