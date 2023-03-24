import { getCloudflareToken } from '../cloudflareToken'

export const getPublicHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'cf-turnstile-response': getCloudflareToken(),
})
