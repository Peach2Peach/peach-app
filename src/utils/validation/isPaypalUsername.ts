import { isUsername } from './isUsername'

export const isPaypalUsername = (username: string) =>
  isUsername(username) && username.length <= 21 && !/[A-Z]/u.test(username) && /[a-z]/u.test(username)
