import { NETWORK } from '@env'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CancelIcon, HelpIcon } from '../../../components/icons'
import { useMatchStore } from '../../../components/matches/store'
import { OverlayContext } from '../../../contexts/overlay'
import checkFundingStatusEffect from '../../../effects/checkFundingStatusEffect'
import { useCancelOffer, useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowHelp } from '../../../hooks/useShowHelp'
import Refund from '../../../overlays/Refund'
import i18n from '../../../utils/i18n'
import { info } from '../../../utils/log'
import { saveOffer } from '../../../utils/offer'
import { fundEscrow, generateBlock } from '../../../utils/peachAPI'
import createEscrowEffect from '../effects/createEscrowEffect'

export const useFundEscrowSetup = () => {
  const route = useRoute<'fundEscrow'>()
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)
  const showHelp = useShowHelp('escrow')
  const showMempoolHelp = useShowHelp('mempool')
  const showError = useShowErrorBanner()
  const [sellOffer, setSellOffer] = useState<SellOffer>(route.params.offer)
  const [updatePending, setUpdatePending] = useState(true)
  const [showRegtestButton, setShowRegtestButton] = useState(
    NETWORK === 'regtest' && sellOffer.funding.status === 'NULL',
  )
  const [escrow, setEscrow] = useState(sellOffer.escrow || '')
  const [fundingError, setFundingError] = useState<FundingError>('')
  const [fundingStatus, setFundingStatus] = useState<FundingStatus>(sellOffer.funding)
  const fundingAmount = Math.round(sellOffer.amount)
  const cancelOffer = useCancelOffer(sellOffer)

  useHeaderSetup(
    useMemo(
      () =>
        fundingStatus.status === 'MEMPOOL'
          ? {
            title: i18n('sell.funding.mempool.title'),
            hideGoBackButton: true,
            icons: [{ iconComponent: <HelpIcon />, onPress: showMempoolHelp }],
          }
          : {
            title: i18n('sell.escrow.title'),
            hideGoBackButton: true,
            icons: [
              { iconComponent: <CancelIcon />, onPress: cancelOffer },
              { iconComponent: <HelpIcon />, onPress: showHelp },
            ],
          },
      [fundingStatus, cancelOffer, showHelp, showMempoolHelp],
    ),
  )

  const navigateToYourTrades = useCallback(() => navigation.replace('yourTrades'), [navigation])

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
        onError: (err) => showError(err.error || 'CREATE_ESCROW_ERROR'),
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
        })
        setFundingStatus(() => result.funding)
        setFundingError(() => result.error || '')
      },
      onError: (err) => {
        showError(err.error || 'GENERAL_ERROR')
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
      matchStoreSetOffer(sellOffer)
      navigation.replace('offerPublished')
    }
  }, [fundingStatus, matchStoreSetOffer, navigateToYourTrades, navigation, sellOffer, updateOverlay])

  return {
    sellOffer,
    updatePending,
    showRegtestButton,
    escrow,
    fundingError,
    fundingStatus,
    fundingAmount,
    fundEscrowAddress,
    cancelOffer,
  }
}
