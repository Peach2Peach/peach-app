import { API_URL } from '@env'
import { PeachAPI } from '../../../peach-api'
import { UNIQUEID } from '../../constants'

export const peachAPI = new PeachAPI({
  url: API_URL,
  peachAccount: null,
  uniqueId: UNIQUEID,
})
