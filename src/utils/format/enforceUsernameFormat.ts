export const enforceUsernameFormat = (usr: string) => {
  const cleaned = usr.toLowerCase().replace(/[^a-z0-9_]/gu, "");
  return cleaned.startsWith("@") ? cleaned : `@${cleaned}`;
};
