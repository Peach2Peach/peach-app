let cloudflareToken: string | undefined
export const setCloudflareToken = (token: string) => (cloudflareToken = token)
export const getCloudflareToken = () => cloudflareToken
export const deleteCloudflareToken = () => (cloudflareToken = undefined)
