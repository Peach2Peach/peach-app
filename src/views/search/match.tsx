import i18n from '../../utils/i18n'

import { account } from '../../utils/account'
import { checkRefundPSBT, signPSBT } from '../../utils/bitcoin'
import { getRandom } from '../../utils/crypto'
import { error, info } from '../../utils/log'
import { getPaymentDataByMethod } from '../../utils/offer'
import { encryptPaymentData } from '../../utils/paymentMethod'
import { matchOffer, patchOffer } from '../../utils/peachAPI'
import { signAndEncrypt } from '../../utils/pgp'
import { decryptSymmetricKey } from '../contract/helpers/parseContract'
import DifferentCurrencyWarning from '../../overlays/DifferentCurrencyWarning'
import React from 'react'
import { PaymentDataMissing } from '../../messageBanners/PaymentDataMissing'
import { StackNavigation } from '../../utils/navigation'
import { Level } from '../../contexts/message'

const messageLevels: Record<string, Level> = {
  NOT_FOUND: 'WARN',
  CANNOT_DOUBLEMATCH: 'WARN',
}

// eslint-disable-next-line max-statements, max-lines-per-function, complexity
export const matchFn = async (
  match: Match,
  offer: BuyOffer | SellOffer,
  selectedCurrency: Currency | undefined,
  selectedPaymentMethod: string | undefined,
  updateOverlay: (value: OverlayState) => void,
  setMatchLoading: (value: React.SetStateAction<boolean>) => void,
  setMatches: (value: React.SetStateAction<Match[]>) => void,
  updateMessage: (value: MessageState) => void,
  saveAndUpdate: (offerData: BuyOffer | SellOffer) => void,
  navigation: StackNavigation,
  openAddPaymentMethodDialog: () => void,
  // eslint-disable-next-line max-params
) => {
  if (!offer || !offer.id) return

  if (!selectedCurrency || !selectedPaymentMethod) {
    error(
      'Match data missing values.',
      `selectedCurrency: ${selectedCurrency}`,
      `selectedPaymentMethod: ${selectedPaymentMethod}`,
    )
    return
  }

  let encryptedSymmmetricKey
  let encryptedPaymentData

  if (
    !offer.meansOfPayment[selectedCurrency]
    || offer.meansOfPayment[selectedCurrency]!.indexOf(selectedPaymentMethod) === -1
  ) {
    updateOverlay({
      content: <DifferentCurrencyWarning currency={selectedCurrency} paymentMethod={selectedPaymentMethod} />,
      showCloseButton: false,
      showCloseIcon: false,
    })
  }

  setMatchLoading(true)

  if (offer.type === 'bid') {
    encryptedSymmmetricKey = await signAndEncrypt(
      (await getRandom(256)).toString('hex'),
      [account.pgp.publicKey, match.user.pgpPublicKey].join('\n'),
    )
  } else if (offer.type === 'ask') {
    const [symmetricKey] = await decryptSymmetricKey(
      match.symmetricKeyEncrypted,
      match.symmetricKeySignature,
      match.user.pgpPublicKey,
    )

    const paymentDataForMethod = getPaymentDataByMethod(offer, selectedPaymentMethod)

    if (!paymentDataForMethod) {
      error('Payment data could not be found for offer', offer.id)
      updateMessage({
        template: <PaymentDataMissing {...{ openAddPaymentMethodDialog }} />,
        level: 'ERROR',
      })
      return
    }

    encryptedPaymentData = await encryptPaymentData(paymentDataForMethod, symmetricKey)
  }

  const [result, err] = await matchOffer({
    offerId: offer.id,
    matchingOfferId: match.offerId,
    currency: selectedCurrency,
    paymentMethod: selectedPaymentMethod,
    symmetricKeyEncrypted: encryptedSymmmetricKey?.encrypted,
    symmetricKeySignature: encryptedSymmmetricKey?.signature,
    paymentDataEncrypted: encryptedPaymentData?.encrypted,
    paymentDataSignature: encryptedPaymentData?.signature,
    hashedPaymentData: offer.paymentData[selectedPaymentMethod]!.hash || '',
  })

  if (result) {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.offerId !== match.offerId) return m
        m.matched = true
        if (result.matchedPrice) m.matchedPrice = result.matchedPrice
        return m
      }),
    )

    if (offer.type === 'ask' && result.refundTx) {
      let refundTx: string | null = null
      const { isValid, psbt } = checkRefundPSBT(result.refundTx, offer)
      if (isValid && psbt) {
        const signedPSBT = signPSBT(psbt, offer, false)
        const [patchOfferResult] = await patchOffer({
          offerId: offer.id!,
          refundTx: signedPSBT.toBase64(),
        })
        if (patchOfferResult) refundTx = psbt.toBase64()
      }
      saveAndUpdate({
        ...offer,
        doubleMatched: true,
        contractId: result.contractId,
        refundTx: refundTx || offer.refundTx,
      })

      if (result.contractId) {
        info('Search.tsx - _match', `navigate to contract ${result.contractId}`)
        navigation.replace('contract', { contractId: result.contractId })
      }
    }
  } else {
    error('Error', err)
    if (err?.error) {
      const msgKey = err?.error === 'NOT_FOUND' ? 'OFFER_TAKEN' : err?.error
      updateMessage({
        msgKey: msgKey || i18n('error.general', ((err?.details as string[]) || []).join(', ')),
        level: messageLevels[err?.error] || 'ERROR',
      })
    }
  }
  setMatchLoading(false)
}
