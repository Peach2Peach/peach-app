export const getLocaleLanguage = (locale: string) =>
  locale.replace("_", "-").split("-")[0];
