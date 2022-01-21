import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { BitcoinAddress, Card, Text } from '../../components'
import i18n from '../../utils/i18n'
import { SellViewProps } from './Sell'
import { createEscrow } from '../../utils/peachAPI'
import { wallet } from '../../utils/bitcoinUtils'
import { saveOffer } from '../../utils/accountUtils'

export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)

  const [escrow, setEscrow] = useState(offer.escrow || '')
  const [fundingStatus, setFundingStatus] = useState<FundingStatus>(offer.funding || {
    confirmations: 0,
    status: 'NULL'
  })

  useEffect(() => {
    (async () => {
      if (!offer.offerId || offer.escrow) return

      const publicKey = wallet.derivePath(`m/45/0/0/${offer.offerId}`).publicKey.toString('hex')
      const [result, error] = await createEscrow({
        offerId: offer.offerId,
        publicKey
      })
      if (result) {
        setEscrow(result.escrow)
        setFundingStatus(result.funding)
        updateOffer({
          ...offer,
          escrow: result.escrow,
          funding: result.funding,
        })
        saveOffer({
          ...offer,
          escrow: result.escrow,
          funding: result.funding,
        })
      }
    })()
  }, [])

  return <View style={tw`mt-16`}>
    <BitcoinAddress
      style={tw`my-4`}
      address={escrow}
      showQR={true}
    />
    <Text>Confirmations: {fundingStatus.confirmations}</Text>
    <Text>Status: {fundingStatus.status}</Text>
  </View>
}