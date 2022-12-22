import { NETWORK } from '@env'
import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Loading, PeachScrollView, PrimaryButton, SatsFormat, Text, Title } from '../../components'
import { useMatchStore } from '../../components/matches/store'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import checkFundingStatusEffect from '../../effects/checkFundingStatusEffect'
import { useNavigation, useRoute } from '../../hooks'
import ConfirmCancelOffer from '../../overlays/ConfirmCancelOffer'
import Escrow from '../../overlays/info/Escrow'
import Refund from '../../overlays/Refund'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { info } from '../../utils/log'
import { offerIdToHex, saveOffer } from '../../utils/offer'
import { fundEscrow, generateBlock } from '../../utils/peachAPI'
import FundingView from './components/FundingView'
import NoEscrowFound from './components/NoEscrowFound'
import createEscrowEffect from './effects/createEscrowEffect'

export default (): ReactElement => {
  const route = useRoute<'fundEscrow'>()
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)
  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)

  const [sellOffer, setSellOffer] = useState<SellOffer>(route.params.offer)
  const [updatePending, setUpdatePending] = useState(true)
  const [showRegtestButton, setShowRegtestButton] = useState(
    NETWORK === 'regtest' && sellOffer.funding.status === 'NULL',
  )
  const [escrow, setEscrow] = useState(sellOffer.escrow || '')
  const [fundingError, setFundingError] = useState<FundingError>('')
  const [fundingStatus, setFundingStatus] = useState<FundingStatus>(sellOffer.funding)
  const fundingAmount = Math.round(sellOffer.amount)

  const buttonText: string | JSX.Element
    = sellOffer.funding.status === 'MEMPOOL' ? (
      i18n('sell.escrow.waitingForConfirmation')
    ) : (
      <View style={tw`flex-row items-center`}>
        <Text style={tw`font-baloo text-sm uppercase text-white-1`}>{i18n('sell.escrow.fundToContinue')}</Text>
        <Loading style={tw`w-10`} color={tw`text-white-1`.color} />
      </View>
    )

  const navigateToOffer = () => navigation.replace('offer', { offer: sellOffer })
  const navigateToYourTrades = useCallback(() => navigation.replace('yourTrades'), [navigation])

  const cancelOffer = () =>
    updateOverlay({
      content: <ConfirmCancelOffer {...{ offer: sellOffer, navigate: navigateToOffer }} />,
      visible: true,
    })

  const subtitle
    = fundingStatus.status === 'MEMPOOL' ? i18n('sell.escrow.subtitle.mempool') : i18n('sell.escrow.subtitle')

  const saveAndUpdate = (offerData: SellOffer, shield = true) => {
    setSellOffer(offerData)
    saveOffer(offerData, undefined, shield)
  }

  const fundEscrowAddress = async () => {
    if (!sellOffer.id || NETWORK !== 'regtest' || fundingStatus.status !== 'NULL') return
    const [fundEscrowResult] = await fundEscrow({ offerId: sellOffer.id })
    if (!fundEscrowResult) return
    const [generateBockResult] = await generateBlock({})
    if (generateBockResult) setShowRegtestButton(false)
  }

  useFocusEffect(
    useCallback(() => {
      setSellOffer(route.params.offer)
      setEscrow(route.params.offer.escrow || '')
      setUpdatePending(!route.params.offer.escrow)
      setFundingStatus(route.params.offer.funding)
    }, [route]),
  )

  useEffect(
    !sellOffer.escrow
      ? createEscrowEffect({
        sellOffer,
        onSuccess: (result) => {
          info('Created escrow', result)
          setEscrow(() => result.escrow)
          setFundingStatus(() => result.funding)
          setUpdatePending(false)
          saveAndUpdate({
            ...sellOffer,
            escrow: result.escrow,
            funding: result.funding,
          })
        },
        onError: (err) =>
          updateMessage({
            msgKey: err.error || 'CREATE_ESCROW_ERROR',
            level: 'ERROR',
            action: {
              callback: () => navigation.navigate('contact'),
              label: i18n('contactUs'),
              icon: 'mail',
            },
          }),
      })
      : () => {},
    [sellOffer.id],
  )

  useEffect(
    checkFundingStatusEffect({
      sellOffer,
      onSuccess: (result) => {
        info('Checked funding status', result)

        saveAndUpdate({
          ...sellOffer,
          funding: result.funding,
          returnAddress: result.returnAddress,
          returnAddressRequired: result.returnAddressRequired,
        })
        setFundingStatus(() => result.funding)
        setFundingError(() => result.error || '')
      },
      onError: (err) => {
        updateMessage({
          msgKey: err.error || 'GENERAL_ERROR',
          level: 'ERROR',
          action: {
            callback: () => navigation.navigate('contact'),
            label: i18n('contactUs'),
            icon: 'mail',
          },
        })
      },
    }),
    [sellOffer.id, sellOffer.escrow],
  )

  useEffect(() => {
    if (/WRONG_FUNDING_AMOUNT|CANCELED/u.test(fundingStatus.status)) {
      updateOverlay({
        content: <Refund {...{ sellOffer, navigate: navigateToYourTrades }} />,
        visible: true,
      })
      return
    }

    if (fundingStatus && /FUNDED/u.test(fundingStatus.status)) {
      if (sellOffer.returnAddressRequired) {
        navigation.replace('setReturnAddress', { offer: sellOffer })
      } else {
        matchStoreSetOffer(sellOffer)
        navigation.replace('search')
      }
    }
  }, [fundingStatus, matchStoreSetOffer, navigateToYourTrades, navigation, sellOffer, updateOverlay])

  return (
    <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`px-6 pt-7 pb-10`}>
      <View style={tw``}>
        <Title title={i18n('sell.title')} subtitle={subtitle} help={<Escrow />} />
        {updatePending && (
          <View style={tw` items-center justify-center items-center`}>
            <Loading />
          </View>
        )}
        {sellOffer.id && escrow && fundingStatus && !fundingError ? (
          <View>
            <Text style={tw`mt-6 mb-5 text-center`}>
              <Text style={tw`font-baloo text-lg uppercase text-grey-2`}>{i18n('sell.escrow.sendSats.1')} </Text>
              <SatsFormat style={tw`font-baloo text-lg uppercase`} sats={fundingAmount} color={tw`text-grey-2`} />
              <Text style={tw`font-baloo text-lg uppercase text-grey-2`}> {i18n('sell.escrow.sendSats.2')}</Text>
            </Text>
            <FundingView
              escrow={escrow}
              amount={sellOffer.amount}
              label={`Peach Escrow - offer ${offerIdToHex(sellOffer.id)}`}
            />
          </View>
        ) : (
          <NoEscrowFound />
        )}
      </View>
      <View style={tw`w-full flex items-center mt-4`}>
        <PrimaryButton
          testID="navigation-next"
          disabled
          narrow
          style={sellOffer.funding.status === 'MEMPOOL' ? tw`w-72` : tw`w-48`}
        >
          {buttonText}
        </PrimaryButton>
        {showRegtestButton && (
          <PrimaryButton testID="escrow-fund" style={tw`mt-1`} onPress={fundEscrowAddress} narrow>
            {'Fund escrow'}
          </PrimaryButton>
        )}
        <Pressable style={tw`mt-4`} onPress={cancelOffer}>
          <Text style={tw`font-baloo text-sm text-peach-1 underline text-center uppercase`}>{i18n('cancelOffer')}</Text>
        </Pressable>
      </View>
    </PeachScrollView>
  )
}
