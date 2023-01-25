import { NETWORK } from '@env'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Button, Loading, PeachScrollView, SatsFormat, Text, Title } from '../../components'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import checkFundingStatusEffect from '../../effects/checkFundingStatusEffect'
import ConfirmCancelOffer from '../../overlays/ConfirmCancelOffer'
import Escrow from '../../overlays/info/Escrow'
import Refund from '../../overlays/Refund'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { info } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { offerIdToHex, saveOffer } from '../../utils/offer'
import { fundEscrow, generateBlock } from '../../utils/peachAPI'
import FundingView from './components/FundingView'
import NoEscrowFound from './components/NoEscrowFound'
import createEscrowEffect from './effects/createEscrowEffect'

type Props = {
  route: RouteProp<{ params: RootStackParamList['fundEscrow'] }>
  navigation: StackNavigation
}

export default ({ route, navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

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
      <Text style={tw`font-baloo text-sm uppercase text-white-1`}>
        {i18n('sell.escrow.fundToContinue')}
        <View style={tw`w-8 h-0 bg-red absolute -mt-10`}>
          <Loading size="small" style={tw`-mt-2`} color={tw`text-white-1`.color as string} />
        </View>
      </Text>
    )

  const navigateToOffer = () => (sellOffer.id ? navigation.replace('offer', { offerId: sellOffer.id }) : null)
  const navigateToYourTrades = useCallback(() => navigation.replace('yourTrades', {}), [navigation])

  const cancelOffer = () =>
    updateOverlay({
      content: <ConfirmCancelOffer {...{ offer: sellOffer, navigate: navigateToOffer, navigation }} />,
      showCloseButton: false,
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
        onError: (err) => updateMessage({ msgKey: err.error || 'error.createEscrow', level: 'ERROR' }),
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
          msgKey: err.error || 'error.general',
          level: 'ERROR',
        })
      },
    }),
    [sellOffer.id, sellOffer.escrow],
  )

  useEffect(() => {
    if (/WRONG_FUNDING_AMOUNT|CANCELED/u.test(fundingStatus.status)) {
      updateOverlay({
        content: <Refund {...{ sellOffer, navigate: navigateToYourTrades, navigation }} />,
        showCloseButton: false,
      })
      return
    }

    if (fundingStatus && /FUNDED/u.test(fundingStatus.status)) {
      if (sellOffer.returnAddressRequired) {
        navigation.replace('setReturnAddress', { offer: sellOffer })
      } else {
        navigation.replace('search', { offerId: sellOffer.id })
      }
    }
  }, [fundingStatus, navigateToYourTrades, navigation, sellOffer, updateOverlay])

  return (
    <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`px-6 pt-7 pb-10`}>
      <View style={tw``}>
        <Title title={i18n('sell.title')} subtitle={subtitle} help={<Escrow />} />
        {updatePending ? (
          <Loading />
        ) : sellOffer.id && escrow && fundingStatus && !fundingError ? (
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
        <Button
          testID="navigation-next"
          disabled={true}
          wide={false}
          title={buttonText}
          style={sellOffer.funding.status === 'MEMPOOL' ? tw`w-72` : tw`w-48`}
        />
        {showRegtestButton ? (
          <Button
            testID="escrow-fund"
            style={tw`mt-1`}
            onPress={fundEscrowAddress}
            help={true}
            wide={false}
            title={'Fund escrow'}
          />
        ) : null}
        <Pressable style={tw`mt-4`} onPress={cancelOffer}>
          <Text style={tw`font-baloo text-sm text-peach-1 underline text-center uppercase`}>{i18n('cancelOffer')}</Text>
        </Pressable>
      </View>
    </PeachScrollView>
  )
}
