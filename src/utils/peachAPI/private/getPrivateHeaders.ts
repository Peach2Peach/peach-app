import { getPublicHeaders } from '../public/getPublicHeaders'
import { fetchAccessToken } from './user'

export const getPrivateHeaders = async (): Promise<RequestInit['headers']> => ({
  ...getPublicHeaders(),
  Authorization: await fetchAccessToken(),
})
