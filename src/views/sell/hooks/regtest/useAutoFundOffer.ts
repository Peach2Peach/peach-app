import { NETWORK } from '@env'
import { useState } from 'react'
import { fundEscrow, generateBlock } from '../../../../utils/peachAPI'

type Props = {
  offerId: string
  fundingStatus: FundingStatus
}
export const useAutoFundOffer = ({ offerId, fundingStatus }: Props) => {
  const [showRegtestButton, setShowRegtestButton] = useState(NETWORK === 'regtest' && fundingStatus.status === 'NULL')

  const fundEscrowAddress = async () => {
    if (!offerId || NETWORK !== 'regtest' || fundingStatus.status !== 'NULL') return
    const [fundEscrowResult] = await fundEscrow({ offerId })
    if (!fundEscrowResult) return
    const [generateBockResult] = await generateBlock({})
    if (generateBockResult) setShowRegtestButton(false)
  }

  return { showRegtestButton, fundEscrowAddress }
}
