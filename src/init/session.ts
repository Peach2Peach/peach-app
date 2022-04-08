import { setBuckets, setPaymentMethods, setPeachFee } from '../constants'
import { loadAccount } from '../utils/account'
import { getInfo } from '../utils/peachAPI'
import { initSession } from '../utils/session'

export default async () => {
  const { password } = await initSession()
  if (password) await loadAccount(password)

  const [peachInfo, err] = await getInfo()

  if (peachInfo) {
    setPaymentMethods(peachInfo.paymentMethods)
    setBuckets(peachInfo.buckets)
    setPeachFee(peachInfo.fees.escrow)
  }
}