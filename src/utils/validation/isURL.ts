const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$|^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^/]*$/u
const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/u
const ipv6Regex = /^(?:[0-9a-z]{0,4}:){7}[0-9a-z]{0,4}$/iu

export const isURL = (url: string) => urlRegex.test(url) || ipv4Regex.test(url) || ipv6Regex.test(url)
