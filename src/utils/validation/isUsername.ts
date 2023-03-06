export const isUsername = (username: string) => username !== '@' && /^@[a-z0-9]*$/iu.test(username)
