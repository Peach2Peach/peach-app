import { API_URL } from '@env'
import { PeachAPI } from '../../../peach-api'
import { UNIQUEID } from '../../constants'
import { getPeachAccount } from './peachAccount'

export const peachAPI = new PeachAPI({
  url: API_URL,
  peachAccount: getPeachAccount(),
  uniqueId: UNIQUEID,
})
