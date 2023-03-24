import { getCloudflareToken } from '../cloudflareToken'
import { fetchAccessToken } from './user'

type CloudflareHeaders = {
  'cf-turnstile-response': string
}
export const getPrivateHeaders = async (): Promise<RequestInit['headers'] & CloudflareHeaders> => ({
  Authorization: await fetchAccessToken(),
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'cf-turnstile-response': getCloudflareToken(),
})
