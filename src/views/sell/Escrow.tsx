import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { BitcoinAddress, Button, Text } from '../../components'
import i18n from '../../utils/i18n'
import { SellViewProps } from './Sell'
import { createEscrow, getFundingStatus } from '../../utils/peachAPI'
import { getPublicKeyForEscrow } from '../../utils/walletUtils'
import { saveOffer } from '../../utils/accountUtils'
import { error, info } from '../../utils/logUtils'
import { MessageContext } from '../../utils/messageUtils'

const defaultFunding: FundingStatus = {
  confirmations: 0,
  status: 'NULL',
  amount: 0
}

// eslint-disable-next-line max-lines-per-function
export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const [escrow, setEscrow] = useState(offer.escrow || '')
  const [fundingError, setFundingError] = useState('')
  const [fundingStatus, setFundingStatus] = useState<FundingStatus>(offer.funding || defaultFunding)

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
      setFundingStatus(() => result.funding)
      saveAndUpdate({
        ...offer,
        funding: result.funding,
      })

      if (result.error) setFundingError(result.error)
    }
  }

  useEffect(() => {
    if (fundingStatus && /MEMPOOL|FUNDED/u.test(fundingStatus.status)) setStepValid(true)
  }, [fundingStatus])

  useEffect(() => {
    // workaround to update escrow status if offer changes
    setEscrow(() => offer.escrow || '')
    setFundingStatus(() => offer.funding || defaultFunding)
  }, [offer.offerId])

  useEffect(() => {
    let interval: NodeJS.Timer
    (async () => {
      interval = setInterval(checkFundingStatus, 20 * 1000)

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
        setEscrow(() => result.escrow)
        setFundingStatus(() => result.funding)
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
    {fundingStatus && !fundingError
      ? <View>
        <Text>Send: {Math.round(offer.amount * (1 + offer.premium / 100))} sats to</Text>
        <BitcoinAddress
          style={tw`my-4`}
          address={escrow}
          showQR={true}
        />
        <Text>Confirmations: {fundingStatus.confirmations}</Text>
        <Text>Status: {fundingStatus.status}</Text>
      </View>
      : fundingError && fundingError === 'WRONG_FUNDING_AMOUNT'
        ? <View style={tw`flex justify-center items-center`}>
          <Text>
            {i18n('error.WRONG_FUNDING_AMOUNT')}
          </Text>
          <Button
            style={tw`mt-6`}
            wide={false}
            onPress={() => {}} // TODO add refunding logic
            title={i18n('refund')}
          />
        </View>
        // TODO: create escrow not found error message here
        : <Text>404 Escrow not found</Text>
    }
  </View>
}