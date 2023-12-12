import { useState } from 'react'
import 'react-native-url-polyfill/auto'

import Clipboard from '@react-native-clipboard/clipboard'
import { getBitcoinAddressParts } from '../../../utils/bitcoin/getBitcoinAddressParts'
import { openInWallet } from '../../../utils/bitcoin/openInWallet'

export type BitcoinAddressProps = {
  address: string
  amount?: number
  label?: string
}
export const useBitcoinAddressSetup = ({ address, amount, label }: BitcoinAddressProps) => {
  const [showAddressCopied, setShowAddressCopied] = useState(false)
  const [showPaymentRequestCopied, setShowPaymentRequestCopied] = useState(false)
  const urn = new URL(`bitcoin:${address}`)

  if (amount) urn.searchParams.set('amount', String(amount))
  if (label) urn.searchParams.set('message', label)

  const addressParts = getBitcoinAddressParts(address)

  const copyAddress = () => {
    Clipboard.setString(address)
    setShowAddressCopied(true)
    setTimeout(() => setShowAddressCopied(false), 1500)
  }

  const copyPaymentRequest = () => {
    Clipboard.setString(urn.toString())
    setShowPaymentRequestCopied(true)
    setTimeout(() => setShowPaymentRequestCopied(false), 1500)
  }

  const openInWalletOrCopyPaymentRequest = async () => {
    if (!(await openInWallet(urn.toString()))) copyPaymentRequest()
  }

  return {
    openInWalletOrCopyPaymentRequest,
    copyPaymentRequest,
    copyAddress,
    showAddressCopied,
    showPaymentRequestCopied,
    addressParts,
    urn,
  }
}
