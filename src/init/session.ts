import { setBuckets, setDeprecatedBuckets, setMinAppVersion, setPaymentMethods, setPeachFee } from '../constants'
import { defaultAccount, loadAccount, updateTradingLimit } from '../utils/account'
import { error } from '../utils/log'
import { getInfo, getTradingLimit } from '../utils/peachAPI'
import { getSession, initSession, setSession } from '../utils/session'

export default async () => {
  let account

  try {
    const { password } = await initSession()
    if (password) account = await loadAccount(password)
  } catch (e) {
    error(e)
  }

  const [
    [peachInfoResponse, err],
    [tradingLimit, tradingLimitErr],
  ] = await Promise.all([
    getInfo(),
    account?.publicKey ? getTradingLimit() : [defaultAccount.tradingLimit, null]
  ])

  let peachInfo = peachInfoResponse

  if (!peachInfo || !tradingLimit) {
    error('Error fetching peach info', JSON.stringify(err || tradingLimitErr))
    peachInfo = getSession().peachInfo || null
  }
  if (tradingLimit) {
    updateTradingLimit(tradingLimit)
  }
  if (peachInfo) {
    setPaymentMethods(peachInfo.paymentMethods)
    setBuckets(peachInfo.buckets)
    setDeprecatedBuckets(peachInfo.deprecatedBuckets)
    setPeachFee(peachInfo.fees.escrow)
    setMinAppVersion(peachInfo.minAppVersion)
    setSession({ peachInfo })
  }
}