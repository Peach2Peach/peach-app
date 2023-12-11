import { API_URL } from '@env'
import { peachAPI as peachAPIFactory } from '../../../peach-api'
import { UNIQUEID } from '../../constants'
import { getPeachAccount } from './peachAccount'

export const peachAPI = peachAPIFactory({
  url: API_URL,
  peachAccount: getPeachAccount(),
  uniqueId: UNIQUEID,
})
