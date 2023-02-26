import { NETWORK } from '@env'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CancelIcon, HelpIcon } from '../../../components/icons'
import checkFundingStatusEffect from '../../../effects/checkFundingStatusEffect'
import { useCancelOffer, useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useConfirmEscrowOverlay } from '../../../overlays/useConfirmEscrowOverlay'
import { useStartRefundOverlay } from '../../../overlays/useStartRefundOverlay'
import { useWronglyFundedOverlay } from '../../../overlays/useWronglyFundedOverlay'
import i18n from '../../../utils/i18n'
import { info } from '../../../utils/log'
import { saveOffer } from '../../../utils/offer'
import { fundEscrow, generateBlock } from '../../../utils/peachAPI'
import { useOfferMatches } from '../../search/hooks/useOfferMatches'
import createEscrowEffect from '../effects/createEscrowEffect'

export const useFundEscrowSetup = () => {
  const route = useRoute<'fundEscrow'>()
  const navigation = useNavigation()

  const startRefund = useStartRefundOverlay()
  const showHelp = useShowHelp('escrow')
  const showMempoolHelp = useShowHelp('mempool')
  const showError = useShowErrorBanner()
  const showWronglyFundedOverlay = useWronglyFundedOverlay()
  const showEscrowConfirmOverlay = useConfirmEscrowOverlay()

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
  const { refetch } = useOfferMatches(sellOffer.id)

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

  const saveAndUpdate = (offerData: SellOffer) => {
    setSellOffer(offerData)
    saveOffer(offerData)
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
        onError: (err) => showError(err.error),
      })
      : () => {},
    [sellOffer.id],
  )

  useEffect(
    checkFundingStatusEffect({
      sellOffer,
      onSuccess: (result) => {
        info('Checked funding status', result)
        const updatedOffer = {
          ...sellOffer,
          funding: result.funding,
        }

        saveAndUpdate(updatedOffer)
        setFundingStatus(() => result.funding)
        setFundingError(() => result.error || '')

        if (result.funding.status === 'CANCELED') return startRefund(sellOffer)
        if (result.funding.status === 'WRONG_FUNDING_AMOUNT') return showWronglyFundedOverlay(updatedOffer)
        if (result.userConfirmationRequired) return showEscrowConfirmOverlay(updatedOffer)
        if (result.funding.status === 'FUNDED') {
          refetch().then(({ data }) => {
            const allMatches = (data?.pages || []).flatMap((page) => page.matches)
            const hasMatches = allMatches.length > 0
            if (hasMatches) {
              navigation.replace('search', { offerId: sellOffer.id })
            } else {
              navigation.replace('offerPublished', { offerId: sellOffer.id })
            }
          })
        }
        return undefined
      },
      onError: (err) => {
        showError(err.error)
      },
    }),
    [sellOffer.id, sellOffer.escrow],
  )

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
