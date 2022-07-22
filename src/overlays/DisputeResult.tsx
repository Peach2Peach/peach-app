import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../styles/tailwind'

import { Button, Headline, Loading, Text } from '../components'
import i18n from '../utils/i18n'

import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { MessageContext } from '../contexts/message'
import { OverlayContext } from '../contexts/overlay'
import getContractEffect from '../effects/getContractEffect'
import { account } from '../utils/account'
import { saveContract, signReleaseTx } from '../utils/contract'
import { error } from '../utils/log'
import { getOffer } from '../utils/offer'
import { confirmPayment } from '../utils/peachAPI'
import Refund from './Refund'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, keyof RootStackParamList>

type DisputeWonSellerProps = {
  contract: Contract,
  offer: SellOffer,
  navigate: () => void,
}

export const DisputeWonSeller = ({ contract, offer, navigate }: DisputeWonSellerProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    saveContract({
      ...contract,
      disputeResultAcknowledged: true,
    })
    navigate()
    updateOverlay({ content: null, showCloseButton: true })
  }
  const refund = () => {
    saveContract({
      ...contract,
      disputeResultAcknowledged: true,
    })
    updateOverlay({
      content: <Refund offer={offer} navigate={navigate} />,
      showCloseButton: false
    })
  }

  return <View style={tw`px-6`}>
    <Headline style={tw`text-3xl leading-3xl text-white-1`}>
      {i18n('dispute.won')}
    </Headline>
    <View style={tw`flex justify-center items-center`}>
      <View style={tw`flex justify-center items-center`}>
        <Text style={tw`text-white-1 text-center`}>
          {i18n('dispute.seller.won.text.1')}
        </Text>
        {!offer.refunded
          ? <Text style={tw`text-white-1 text-center mt-2`}>
            {i18n('dispute.seller.won.text.2')}
          </Text>
          : null
        }
      </View>
      <Button
        style={tw`mt-5`}
        title={i18n(offer.refunded ? 'close' : 'dispute.seller.won.button')}
        secondary={true}
        wide={false}
        onPress={offer.refunded ? closeOverlay : refund}
      />
    </View>
  </View>
}

type DisputeLostSellerProps = {
  contract: Contract,
  navigate: () => void,
}

export const DisputeLostSeller = ({ contract, navigate }: DisputeLostSellerProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)

  const [loading, setLoading] = useState(false)

  const closeOverlay = () => {
    saveContract({
      ...contract,
      disputeResultAcknowledged: true,
    })
    navigate()
  }
  const release = async () => {
    setLoading(true)

    const [tx, errorMsg] = signReleaseTx(contract)
    if (!tx) {
      setLoading(false)
      updateMessage({ msg: errorMsg!.join('\n'), level: 'WARN' })
      return
    }

    const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })

    setLoading(false)

    if (err) {
      error(err.error)
      updateMessage({ msg: i18n(err.error || 'error.general'), level: 'ERROR' })
      return
    }

    saveContract({
      ...contract,
      paymentConfirmed: new Date(),
      releaseTxId: result?.txId || '',
      disputeResultAcknowledged: true,
    })
    navigate()
  }

  return <View style={tw`px-6`}>
    <Headline style={tw`text-3xl leading-3xl text-white-1`}>
      {i18n('dispute.lost')}
    </Headline>
    <View style={tw`flex justify-center items-center`}>
      <View style={tw`flex justify-center items-center`}>
        <Text style={tw`text-white-1 text-center`}>
          {i18n('dispute.seller.lost.text.1')}
        </Text>
        {!contract.paymentConfirmed
          ? <Text style={tw`text-white-1 text-center mt-2`}>
            {i18n('dispute.seller.lost.text.2')}
          </Text>
          : null
        }
      </View>
      <Button style={tw`mt-5`}
        title={i18n(contract.paymentConfirmed ? 'close' : 'dispute.seller.lost.button')}
        secondary={true} wide={false}
        onPress={contract.paymentConfirmed ? closeOverlay : release}
        loading={loading}
      />
    </View>
  </View>
}


type DisputeWonBuyerProps = {
  contract: Contract,
  navigate: () => void,
}

export const DisputeWonBuyer = ({ contract, navigate }: DisputeWonBuyerProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    saveContract({
      ...contract,
      disputeResultAcknowledged: true,
    })
    navigate()
    updateOverlay({ content: null, showCloseButton: true })
  }

  return <View style={tw`px-6`}>
    <Headline style={tw`text-3xl leading-3xl text-white-1`}>
      {i18n('dispute.won')}
    </Headline>
    <View style={tw`flex justify-center items-center`}>
      <View style={tw`flex justify-center items-center`}>
        <Text style={tw`text-white-1 text-center`}>
          {i18n('dispute.buyer.won.text.1')}
        </Text>
        {!contract.paymentConfirmed
          ? <Text style={tw`text-white-1 text-center mt-2`}>
            {i18n('dispute.buyer.won.text.2')}
          </Text>
          : null
        }
      </View>
      <Button
        style={tw`mt-5`}
        title={i18n('close')}
        secondary={true}
        wide={false}
        onPress={closeOverlay}
      />
    </View>
  </View>
}

type DisputeLostBuyerProps = {
  contract: Contract,
  navigate: () => void,
}

export const DisputeLostBuyer = ({ contract, navigate }: DisputeLostBuyerProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = () => {
    saveContract({
      ...contract,
      disputeResultAcknowledged: true,
    })
    navigate()
    updateOverlay({ content: null, showCloseButton: true })
  }

  return <View style={tw`px-6`}>
    <Headline style={tw`text-3xl leading-3xl text-white-1`}>
      {i18n('dispute.lost')}
    </Headline>
    <View style={tw`flex justify-center items-center`}>
      <View style={tw`flex justify-center items-center`}>
        <Text style={tw`text-white-1 text-center`}>
          {i18n('dispute.buyer.lost.text.1')}
        </Text>
        {!contract.paymentConfirmed
          ? <Text style={tw`text-white-1 text-center mt-2`}>
            {i18n('dispute.buyer.lost.text.2')}
          </Text>
          : null
        }
      </View>
      <Button
        style={tw`mt-5`}
        title={i18n('close')}
        secondary={true}
        wide={false}
        onPress={closeOverlay}
      />
    </View>
  </View>
}

type DisputeResultProps = {
  contractId: Contract['id'],
  navigation: NavigationContainerRefWithCurrent<RootStackParamList>|ProfileScreenNavigationProp,
}

export const DisputeResult = ({ contractId, navigation }: DisputeResultProps) => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const [contract, setContract] = useState<Contract>()
  const [offer, setOffer] = useState<BuyOffer|SellOffer>()

  const [view, setView] = useState<'seller'|'buyer'|''>('')
  const [isWinner, setIsWinner] = useState(false)

  useEffect(getContractEffect({
    contractId,
    onSuccess: async (result) => {
      const newView = result.seller.id === account.publicKey ? 'seller' : 'buyer'
      setContract(result)
      setOffer(getOffer(result.id.split('-')[newView === 'seller' ? 0 : 1]) as BuyOffer|SellOffer)

      setView(newView)
      setIsWinner(newView === result.disputeWinner)
    },
    onError: err => {
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
      updateOverlay({ content: null, showCloseButton: true })
      return navigation.navigate('contract', { contractId })
    }
  }), [contractId])

  const goToOffer = () => {
    navigation.navigate('offer', { offer: offer! })
    updateOverlay({ content: null, showCloseButton: true })
  }

  return !view || !contract || !offer
    ? <Loading color={tw`text-white-1`.color as string} />
    : view === 'seller'
      ? isWinner
        ? <DisputeWonSeller contract={contract} offer={offer as SellOffer} navigate={goToOffer} />
        : <DisputeLostSeller contract={contract} navigate={goToOffer} />
      : isWinner
        ? <DisputeWonBuyer contract={contract} navigate={goToOffer} />
        : <DisputeLostBuyer contract={contract} navigate={goToOffer} />
}