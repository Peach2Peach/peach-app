export const isSteamFriendCode = (friendCode: string) =>
  /^\d{8,20}$/u.test(friendCode);
