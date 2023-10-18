import { API_URL } from '@env'
import peachAPIBuilder from '../../../peach-api'
import { UNIQUEID } from '../../constants'
import { getPeachAccount } from './peachAccount'

export const peachAPI = peachAPIBuilder({
  url: API_URL,
  peachAccount: getPeachAccount(),
  uniqueId: UNIQUEID,
})
