import {
  setBuckets,
  setClientServerTimeDifference,
  setDeprecatedBuckets,
  setLatestAppVersion,
  setMinAppVersion,
  setPaymentMethods,
  setPeachFee,
  setPeachPGPPublicKey,
} from '../constants'
import { UserDataStore } from '../store'
import { defaultAccount } from '../utils/account'
import { saveContracts } from '../utils/contract'
import { error, info } from '../utils/log'
import { saveOffers } from '../utils/offer'
import { getContracts, getInfo, getOffers, getStatus, getTradingLimit } from '../utils/peachAPI'
import { sessionStorage } from '../utils/session'

/**
 * Note: we estimate the time it took for the response to arrive from server to client
 * by dividing the round trip time in half
 * This is only an estimation as round trips are often asymmetric
 */
const calculateClientServerTimeDifference = async () => {
  const start = Date.now()
  const [peachStatusResponse, peachStatusErr] = await getStatus({ timeout: 3000 })
  const end = Date.now()
  const roundTrip = (end - start) / 2

  if (!peachStatusResponse || peachStatusErr) {
    error('Error peach server info', JSON.stringify(peachStatusErr))
    return
  }

  setClientServerTimeDifference(end - roundTrip - peachStatusResponse.serverTime)
}

/**
 * @description Method to fetch peach info and user trading limit and store values in constants
 */
export const getPeachInfo = async (userDataStore: UserDataStore): Promise<GetInfoResponse | null> => {
  const { publicKey, setTradingLimit } = userDataStore

  await calculateClientServerTimeDifference()

  const [peachInfoResponse, err] = await getInfo({ timeout: 10000 })

  let peachInfo = peachInfoResponse

  if (!peachInfo) {
    error('Error fetching peach info', JSON.stringify(err))
    peachInfo = sessionStorage.getMap('peachInfo')
  }

  if (peachInfo) {
    setPeachPGPPublicKey(peachInfo.peach.pgpPublicKey)
    setPaymentMethods(peachInfo.paymentMethods)
    setBuckets(peachInfo.buckets)
    setDeprecatedBuckets(peachInfo.deprecatedBuckets)
    setPeachFee(peachInfo.fees.escrow)
    setLatestAppVersion(peachInfo.latestAppVersion)
    setMinAppVersion(peachInfo.minAppVersion)
    sessionStorage.setMap('peachInfo', peachInfo)
  }

  return peachInfo
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
