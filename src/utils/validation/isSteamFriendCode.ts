export const isSteamFriendCode = (friendCode: string): boolean =>
  /^\d{8,20}$/u.test(friendCode);
