export const enforceUsernameFormat = (usr: string) => {
  const cleaned = usr.toLowerCase().replace(/[^a-z0-9]/gu, "");
  return cleaned.length ? `@${cleaned}` : cleaned;
};
