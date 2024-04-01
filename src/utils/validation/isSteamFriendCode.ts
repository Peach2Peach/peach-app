export const isSteamFriendCode = (friendCode: string): boolean =>
  /^\d{17}$/u.test(friendCode);
