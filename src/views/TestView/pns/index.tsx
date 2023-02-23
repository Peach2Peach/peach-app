/* eslint-disable max-lines */
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import React, { useMemo, useState } from 'react'
import { FlatList, View } from 'react-native'
import { PrimaryButton } from '../../../components'
import { TabbedNavigation } from '../../../components/navigation/TabbedNavigation'
import { useHeaderSetup } from '../../../hooks'
import { useContractMessageHandler } from '../../../hooks/notifications/useContractMessageHandler'
import { useMessageHandler } from '../../../hooks/notifications/useMessageHandler'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import { isBuyOffer, isSellOffer } from '../../../utils/offer'

const useFakePNs = () => {
  const firstSellOffer = useMemo(() => account.offers.find(isSellOffer), [])
  const firstBuyOffer = useMemo(() => account.offers.find(isBuyOffer), [])
  const firstContract = useMemo(() => account.contracts[0], [])
  const sellOfferId = firstSellOffer?.id || '1'
  const buyOfferId = firstBuyOffer?.id || '1'
  const contractId = firstContract?.id || '1-2'

  const fakeOfferPNs = [
    {
      data: {
        type: 'offer.escrowFunded',
        offerId: sellOfferId,
      },
    },
    {
      data: {
        type: 'offer.notFunded',
        offerId: sellOfferId,
      },
      notification: {
        bodyLocArgs: ['P123', '7'],
      },
    },
    {
      data: {
        type: 'offer.fundingAmountDifferent',
        offerId: sellOfferId,
      },
    },
    {
      data: {
        type: 'offer.wrongFundingAmount',
        offerId: sellOfferId,
      },
    },
    {
      data: {
        type: 'offer.sellOfferExpired',
        offerId: sellOfferId,
      },
      notification: {
        bodyLocArgs: ['P123', '14'],
      },
    },
    {
      data: {
        type: 'offer.buyOfferImminentExpiry',
        offerId: buyOfferId,
      },
      notification: {
        bodyLocArgs: ['P123'],
      },
    },
    {
      data: {
        type: 'offer.buyOfferExpired',
        offerId: buyOfferId,
      },
      notification: {
        bodyLocArgs: ['P123', '30'],
      },
    },
    {
      data: {
        type: 'offer.matchBuyer',
        offerId: buyOfferId,
      },
    },
    {
      data: {
        type: 'offer.matchSeller',
        offerId: sellOfferId,
      },
    },
  ]
  const fakeContractPNs = [
    {
      data: {
        type: 'contract.contractCreated',
        offerId: buyOfferId,
        contractId,
      },
    },
    {
      data: {
        type: 'contract.buyer.disputeRaised',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456', '200000'],
      },
    },
    {
      data: {
        type: 'contract.seller.disputeRaised',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456', '200000'],
      },
    },
    {
      data: {
        type: 'contract.seller.inactiveBuyerCancel',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
    {
      data: {
        type: 'contract.buyer.paymentTimerSellerCanceled',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
    {
      data: {
        type: 'contract.buyer.paymentTimerExtended',
        contractId,
      },
    },
    {
      data: {
        type: 'contract.buyer.paymentReminderSixHours',
        contractId,
      },
    },
    {
      data: {
        type: 'contract.buyer.paymentTimerHasRunOut',
        contractId,
      },
    },
    {
      data: {
        type: 'contract.seller.paymentTimerHasRunOut',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
    {
      data: {
        type: 'contract.buyer.paymentReminderOneHour',
        contractId,
      },
    },
    {
      data: {
        type: 'contract.paymentMade',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
    {
      data: {
        type: 'contract.tradeCompleted',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
    {
      data: {
        type: 'contract.chat',
        contractId,
        isChat: 'true',
      },
    },
    {
      data: {
        type: 'contract.disputeResolved',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
    {
      data: {
        type: 'contract.buyer.disputeWon',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
    {
      data: {
        type: 'contract.seller.disputeWon',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
    {
      data: {
        type: 'contract.buyer.disputeLost',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
    {
      data: {
        type: 'contract.seller.disputeLost',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
    {
      data: {
        type: 'contract.canceled',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
    {
      data: {
        type: 'seller.canceledAfterEscrowExpiry',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
    {
      data: {
        type: 'contract.cancelationRequest',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
    {
      data: {
        type: 'contract.cancelationRequestAccepted',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
    {
      data: {
        type: 'contract.cancelationRequestRejected',
        contractId,
      },
      notification: {
        bodyLocArgs: ['PC-123-456'],
      },
    },
  ]
  return { fakeOfferPNs, fakeContractPNs }
}

export default () => {
  useHeaderSetup(useMemo(() => ({ title: 'test view - pns' }), []))
  const messageHandler = useMessageHandler(() => 'testViewPNs')
  const { fakeOfferPNs, fakeContractPNs } = useFakePNs()
  const tabs = [
    { id: 'offer', display: 'offer' },
    { id: 'contract', display: 'contract' },
  ]
  const [currentTab, setCurrentTab] = useState(tabs[0])
  return (
    <View style={tw`py-10`}>
      <TabbedNavigation style={tw`mb-4`} items={tabs} selected={currentTab} select={setCurrentTab} />
      {currentTab.id === 'offer' && (
        <FlatList
          contentContainerStyle={tw`px-6 `}
          data={fakeOfferPNs}
          renderItem={({ item }) => (
            <PrimaryButton onPress={() => messageHandler(item as unknown as FirebaseMessagingTypes.RemoteMessage)}>
              {item.data.type}
            </PrimaryButton>
          )}
          ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        />
      )}
      {currentTab.id === 'contract' && (
        <FlatList
          contentContainerStyle={tw`px-6 `}
          data={fakeContractPNs}
          renderItem={({ item }) => (
            <PrimaryButton onPress={() => messageHandler(item as unknown as FirebaseMessagingTypes.RemoteMessage)}>
              {item.data.type}
            </PrimaryButton>
          )}
          ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        />
      )}
    </View>
  )
}
