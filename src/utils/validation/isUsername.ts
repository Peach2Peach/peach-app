const MAX_USERNAME_LENGTH = 21;
export const isUsername = (username: string) =>
  username !== "@" &&
  /^@[a-z0-9]*$/iu.test(username) &&
  username.length <= MAX_USERNAME_LENGTH;
