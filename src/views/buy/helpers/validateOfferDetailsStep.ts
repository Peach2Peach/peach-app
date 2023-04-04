import { getPaymentData, getSelectedPaymentDataIds } from '../../../utils/account'
import { isDefined } from '../../../utils/array/isDefined'
import { hasMopsConfigured } from '../../../utils/offer'
import { isValidPaymentData } from '../../../utils/paymentMethod'

export const validateOfferDetailsStep = (
  offerDraft: BuyOfferDraft,
  preferredPaymentMethods: Settings['preferredPaymentMethods'],
) =>
  !!offerDraft.amount
  && hasMopsConfigured(offerDraft)
  && getSelectedPaymentDataIds(preferredPaymentMethods).map(getPaymentData)
    .filter(isDefined)
    .every(isValidPaymentData)
