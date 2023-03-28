import { NETWORK } from '@env'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { createEscrow } from '../helpers/createEscrow'

export const useFundEscrowSetup = () => {
  const route = useRoute<'fundEscrow'>()
  const navigation = useNavigation()

  const startRefund = useStartRefundOverlay()
  const showHelp = useShowHelp('escrow')
  const showMempoolHelp = useShowHelp('mempool')
  const showError = useShowErrorBanner()
  const showWronglyFundedOverlay = useWronglyFundedOverlay()
  const showEscrowConfirmOverlay = useConfirmEscrowOverlay()

  const [sellOffer, setSellOffer] = useState(route.params.offer)
  const [updatePending, setUpdatePending] = useState(true)
  const [showRegtestButton, setShowRegtestButton] = useState(
    NETWORK === 'regtest' && sellOffer.funding.status === 'NULL',
  )

  const [fundingError, setFundingError] = useState<FundingError>('')
  const fundingAmount = Math.round(sellOffer.amount)
  const cancelOffer = useCancelOffer(sellOffer)
  const { refetch } = useOfferMatches(sellOffer.id)

  useHeaderSetup(
    useMemo(
      () =>
        sellOffer.funding.status === 'MEMPOOL'
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
      [sellOffer.funding, cancelOffer, showHelp, showMempoolHelp],
    ),
  )

  const saveAndUpdate = (offerData: SellOffer) => {
    setSellOffer(offerData)
    saveOffer(offerData)
  }

  const fundEscrowAddress = async () => {
    if (!sellOffer.id || NETWORK !== 'regtest' || sellOffer.funding.status !== 'NULL') return
    const [fundEscrowResult] = await fundEscrow({ offerId: sellOffer.id })
    if (!fundEscrowResult) return
    const [generateBockResult] = await generateBlock({})
    if (generateBockResult) setShowRegtestButton(false)
  }

  useFocusEffect(
    useCallback(() => {
      setSellOffer(route.params.offer)
      setUpdatePending(!route.params.offer.escrow)
    }, [route]),
  )

  useEffect(() => {
    if (!sellOffer.id || sellOffer.escrow) return
    createEscrow(
      sellOffer.id,
      (result) => {
        info('Created escrow', result)
        setUpdatePending(false)
        saveAndUpdate({
          ...sellOffer,
          escrow: result.escrow,
          funding: result.funding,
        })
      },
      (err) => showError(err.error),
    )
  }, [sellOffer, showError])

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
        setFundingError(result.error || '')

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
              navigation.replace('offerPublished', { isSellOffer: true })
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
    escrow: sellOffer.escrow || '',
    fundingError,
    fundingStatus: sellOffer.funding,
    fundingAmount,
    fundEscrowAddress,
    cancelOffer,
  }
}
