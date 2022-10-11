import {
  setBuckets,
  setDeprecatedBuckets,
  setLatestAppVersion,
  setMinAppVersion,
  setPaymentMethods,
  setPeachFee,
  setPeachPGPPublicKey,
} from '../constants'
import { defaultAccount, loadAccount, updateTradingLimit } from '../utils/account'
import { saveContracts } from '../utils/contract'
import { exists, readFile, writeFile } from '../utils/file'
import { error, info } from '../utils/log'
import { saveOffers } from '../utils/offer'
import { getContracts, getInfo, getOffers, getTradingLimit } from '../utils/peachAPI'
import { initSession } from '../utils/session'

/**
 * @description Method to fetch peach info and user trading limit and store values in constants
 * @param account user account
 */
export const getPeachInfo = async (account?: Account) => {
  const [[peachInfoResponse, err], [tradingLimit, tradingLimitErr]] = await Promise.all([
    getInfo({}),
    account?.publicKey ? getTradingLimit() : [defaultAccount.tradingLimit, null],
  ])

  let peachInfo = peachInfoResponse

  if (!peachInfo || !tradingLimit) {
    error('Error fetching peach info', JSON.stringify(err || tradingLimitErr))
    try {
      if (await exists('/peach-info.json')) {
        peachInfo = JSON.parse(await readFile('/peach-info.json')) as GetInfoResponse
      }
    } catch (e) {}
  }
  if (tradingLimit) {
    updateTradingLimit(tradingLimit)
  }
  if (peachInfo) {
    setPeachPGPPublicKey(peachInfo.peach.pgpPublicKey)
    setPaymentMethods(peachInfo.paymentMethods)
    setBuckets(peachInfo.buckets)
    setDeprecatedBuckets(peachInfo.deprecatedBuckets)
    setPeachFee(peachInfo.fees.escrow)
    setLatestAppVersion(peachInfo.latestAppVersion)
    setMinAppVersion(peachInfo.minAppVersion)
    await writeFile('/peach-info.json', JSON.stringify(peachInfo))
  }
}

/**
 * @description Method to fetch users offers and contracts
 */
export const getTrades = async (): Promise<void> => {
  const [offers, getOffersError] = await getOffers({})
  if (offers) {
    info(`Got ${offers.length} offers`)
    saveOffers(offers)
  } else if (getOffersError) {
    error('Error', getOffersError)
  }

  const [contracts, err] = await getContracts({})
  if (contracts) {
    saveContracts(contracts)
  } else if (err) {
    error('Error', err)
  }
}

export default async () => {
  let account

  try {
    const { password } = await initSession()
    if (password) account = await loadAccount(password)
  } catch (e) {
    error(e)
    return false
  }

  return !!account?.publicKey
}
