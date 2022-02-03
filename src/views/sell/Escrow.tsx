import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { BitcoinAddress, Text } from '../../components'
import i18n from '../../utils/i18n'
import { SellViewProps } from './Sell'
import { createEscrow, getFundingStatus } from '../../utils/peachAPI'
import { getPublicKeyForEscrow } from '../../utils/walletUtils'
import { saveOffer } from '../../utils/accountUtils'
import { error, info } from '../../utils/logUtils'
import { MessageContext } from '../../utils/messageUtils'

// eslint-disable-next-line max-lines-per-function
export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const [escrow, setEscrow] = useState(offer.escrow || '')
  const [fundingStatus, setFundingStatus] = useState<FundingStatus>(offer.funding || {
    confirmations: 0,
    status: 'NULL'
  })

  const saveAndUpdate = (offerData: SellOffer) => {
    updateOffer(offerData)
    saveOffer(offerData)
  }

  const checkFundingStatus = async () => {
    if (!offer.offerId || !offer.escrow) return

    info('Checking funding status of', offer.offerId, offer.escrow)
    const [result, err] = await getFundingStatus({
      offerId: offer.offerId,
    })
    if (result) {
      setFundingStatus(result.funding)
      saveAndUpdate({
        ...offer,
        funding: result.funding,
      })
    }
  }

  useEffect(() => {
    if (fundingStatus && /MEMPOOL|FUNDED/u.test(fundingStatus.status)) setStepValid(true)
  }, [fundingStatus])

  useEffect(() => {
    let interval: NodeJS.Timer
    (async () => {
      interval = setInterval(checkFundingStatus, 60 * 1000)

      checkFundingStatus()
    })()
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    (async () => {
      if (!offer.offerId || offer.escrow) return

      const publicKey = getPublicKeyForEscrow(offer.offerId)
      const [result, err] = await createEscrow({
        offerId: offer.offerId,
        publicKey
      })

      if (result) {
        setEscrow(result.escrow)
        setFundingStatus(result.funding)
        saveAndUpdate({
          ...offer,
          escrow: result.escrow,
          funding: result.funding,
        })
      } else {
        error('Error', err)
        updateMessage({
          msg: i18n('error.createEscrow'),
          level: 'ERROR',
        })
      }
    })()
  }, [])

  return <View style={tw`mt-16`}>
    {fundingStatus
      ? <View>
        <BitcoinAddress
          style={tw`my-4`}
          address={escrow}
          showQR={true}
        />
        <Text>Confirmations: {fundingStatus.confirmations}</Text>
        <Text>Status: {fundingStatus.status}</Text>
      </View>
      // TODO: create escrow not found error message here
      : <Text>404 Escrow not found</Text>
    }
  </View>
}