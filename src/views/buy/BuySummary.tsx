import { useMutation } from '@tanstack/react-query'
import { shallow } from 'zustand/shallow'
import { Header, PeachScrollView, Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { BuyOfferSummary } from '../../components/offer'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { publishPGPPublicKey } from '../../init/publishPGPPublicKey'
import { InfoPopup } from '../../popups/InfoPopup'
import { useConfigStore } from '../../store/configStore/configStore'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { useSettingsStore } from '../../store/settingsStore'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import { getMessageToSignForAddress } from '../../utils/account'
import { useAccountStore } from '../../utils/account/account'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { peachAPI } from '../../utils/peachAPI'
import { isValidBitcoinSignature } from '../../utils/validation'
import { peachWallet } from '../../utils/wallet/setWallet'
import { useGlobalSortAndFilterPopup } from '../search/hooks/useSortAndFilterPopup'
import { isForbiddenPaymentMethodError } from './helpers/isForbiddenPaymentMethodError'

export const BuySummary = () => {
  const [peachWalletActive, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.payoutAddressLabel],
    shallow,
  )
  const buyOfferPreferences = useOfferPreferences(
    (state) => ({
      amount: state.buyAmountRange,
      meansOfPayment: state.meansOfPayment,
      paymentData: state.paymentData,
      originalPaymentData: state.originalPaymentData,
      maxPremium: state.filter.buyOffer.maxPremium,
    }),
    shallow,
  )

  const offerDraft = {
    type: 'bid' as const,
    releaseAddress: '',
    ...buyOfferPreferences,
    walletLabel: peachWalletActive ? i18n('peachWallet') : payoutAddressLabel,
  }

  return (
    <Screen header={<BuySummaryHeader />}>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`}>
        <BuyOfferSummary offer={offerDraft} />
      </PeachScrollView>
      <PublishOfferButton offerDraft={offerDraft} />
    </Screen>
  )
}

function BuySummaryHeader () {
  const navigation = useNavigation()
  const showSortAndFilterPopup = useGlobalSortAndFilterPopup('buy')
  const icons = [
    {
      ...headerIcons.bitcoin,
      accessibilityHint: `${i18n('goTo')} ${i18n('settings.networkFees')}`,
      onPress: () => navigation.navigate('networkFees'),
    },
    { ...headerIcons.buyFilter, onPress: showSortAndFilterPopup },
    { ...headerIcons.wallet, onPress: () => navigation.navigate('selectWallet', { type: 'payout' }) },
  ]
  return <Header title={i18n('buy.summary.title')} icons={icons} />
}

function PublishOfferButton ({ offerDraft }: { offerDraft: BuyOfferDraft }) {
  const navigation = useNavigation()
  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressSignature] = useSettingsStore(
    (state) => [state.peachWalletActive, state.setPeachWalletActive, state.payoutAddress, state.payoutAddressSignature],
    shallow,
  )
  const publicKey = useAccountStore((state) => state.account.publicKey)
  if (!peachWalletActive && !payoutAddress) setPeachWalletActive(true)

  const canPublish
    = peachWalletActive
    || (!!payoutAddress
      && !!payoutAddressSignature
      && isValidBitcoinSignature(
        getMessageToSignForAddress(publicKey, payoutAddress),
        payoutAddress,
        payoutAddressSignature,
      ))

  const goToMessageSigning = () => navigation.navigate('signMessage')

  const { mutate, isLoading } = usePublishOffer(offerDraft)

  return (
    <Button style={tw`self-center`} onPress={canPublish ? () => mutate() : goToMessageSigning} loading={isLoading}>
      {i18n(getButtonTextId(canPublish, isLoading))}
    </Button>
  )
}

function getButtonTextId (canPublish: boolean, isPublishing: boolean) {
  if (isPublishing) return 'offer.publishing'
  if (canPublish) return 'offer.publish'
  return 'next'
}

function usePublishOffer (offerDraft: BuyOfferDraft) {
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()
  const hasSeenGroupHugAnnouncement = useConfigStore((state) => state.hasSeenGroupHugAnnouncement)
  const setPopup = usePopupStore((state) => state.setPopup)
  const showHelp = () => setPopup(<InfoPopup content={<Text>{i18n('FORBIDDEN_PAYMENT_METHOD.paypal.text')}</Text>} />)
  const [peachWalletActive, payoutAddress, payoutAddressSignature] = useSettingsStore(
    (state) => [state.peachWalletActive, state.payoutAddress, state.payoutAddressSignature],
    shallow,
  )
  const publicKey = useAccountStore((state) => state.account.publicKey)

  const getMessageSignature = (message: string, releaseAddress: string, index?: number) =>
    peachWalletActive ? peachWallet.signMessage(message, releaseAddress, index) : payoutAddressSignature || ''

  return useMutation({
    mutationFn: async () => {
      const { releaseAddress, index } = await getReleaseAddress(peachWalletActive, payoutAddress)
      if (!releaseAddress) throw new Error('MISSING_ADDRESS')

      const message = getMessageToSignForAddress(publicKey, releaseAddress)
      const messageSignature = getMessageSignature(message, releaseAddress, index)

      if (!isValidBitcoinSignature(message, releaseAddress, messageSignature)) throw new Error('INAVLID_SIGNATURE')
      const finalizedOfferDraft = { ...offerDraft, releaseAddress, message, messageSignature }

      let { result, error: err } = await peachAPI.private.offer.postBuyOffer(finalizedOfferDraft)

      if (err?.error === 'PGP_MISSING') {
        await publishPGPPublicKey()
        const response = await peachAPI.private.offer.postBuyOffer(finalizedOfferDraft)
        result = response.result
        err = response.error
      }
      if (result) {
        return result.id
      }
      throw new Error(err?.error || 'POST_OFFER_ERROR', { cause: err?.details })
    },
    onError: ({ message, cause }: Error) => {
      if (isForbiddenPaymentMethodError(message, cause)) {
        const paymentMethod = cause.pop()
        if (paymentMethod === 'paypal') showHelp()
      } else {
        showErrorBanner(message)
      }
    },
    onSuccess: (offerId) => {
      if (!hasSeenGroupHugAnnouncement) {
        navigation.reset({
          index: 1,
          routes: [{ name: 'yourTrades' }, { name: 'groupHugAnnouncement', params: { offerId } }],
        })
      } else {
        navigation.reset({
          index: 1,
          routes: [
            { name: 'yourTrades' },
            { name: 'offerPublished', params: { offerId, isSellOffer: false, shouldGoBack: true } },
          ],
        })
      }
    },
  })
}

async function getReleaseAddress (peachWalletActive: boolean, payoutAddress: string | undefined) {
  if (peachWalletActive) {
    const { address: releaseAddress, index } = await peachWallet.getAddress()
    return { releaseAddress, index }
  }
  return { releaseAddress: payoutAddress, index: undefined }
}
