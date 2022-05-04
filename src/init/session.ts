import { setBuckets, setMinAppVersion, setPaymentMethods, setPeachFee } from '../constants'
import { loadAccount } from '../utils/account'
import { error } from '../utils/log'
import { getInfo } from '../utils/peachAPI'
import { getSession, initSession, setSession } from '../utils/session'

export default async () => {
  const { password } = await initSession()
  if (password) await loadAccount(password)

  let [peachInfo, err] = await getInfo() // eslint-disable-line prefer-const

  if (!peachInfo) {
    error('Error fetching peach info', JSON.stringify(err))
    peachInfo = getSession().peachInfo || null
  }
  if (peachInfo) {
    setPaymentMethods(peachInfo.paymentMethods)
    setBuckets(peachInfo.buckets)
    setPeachFee(peachInfo.fees.escrow)
    setMinAppVersion(peachInfo.minAppVersion)
    setSession({ peachInfo })
  }
}