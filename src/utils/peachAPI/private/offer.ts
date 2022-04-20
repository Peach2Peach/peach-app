import { API_URL } from '@env'
import { parseResponse } from '..'
import fetch from '../../fetch'
import { getAccessToken } from './user'

/**
 * @description Method to get offer
 * @param offerId offer id
 * @returns GetOffersResponse
 */
export const getOfferDetails = async (offerId: string): Promise<[BuyOffer|SellOffer|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/details`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<BuyOffer|SellOffer>(response, 'getOffer')
}

/**
 * @description Method to get offer of user
 * @returns GetOffersResponse
 */
export const getOffers = async (): Promise<[(SellOffer|BuyOffer)[]|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offers`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<(SellOffer|BuyOffer)[]>(response, 'getOffers')
}

type PostOfferProps = {
  type: OfferType,
  amount: number,
  premium?: number,
  currencies: Currency[],
  paymentMethods: PaymentMethod[],
  kyc: boolean,
  returnAddress?: string,
  releaseAddress?: string
}

/**
 * @description Method to post offer
 * @param type ask or bid
 * @param amount Amount in sats (250k 500k 1M 2M 5M)
 * @param premium Premium in % (default: 0)
 * @param currencies Post offer of specific currency
 * @param paymentMethods Post offer for specific payment methods
 * @param kyc If true, require KYC
 * @param returnAddress Bitcoin address to return funds to in case of cancellation
 * @returns PostOfferResponse
 */
export const postOffer = async ({
  type,
  amount,
  premium = 0,
  currencies,
  paymentMethods,
  kyc,
  returnAddress,
  releaseAddress
}: PostOfferProps): Promise<[PostOfferResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      type,
      amount,
      premium,
      currencies,
      paymentMethods,
      kyc,
      returnAddress,
      releaseAddress
    })
  })

  return await parseResponse<PostOfferResponse>(response, 'postOffer')
}

type CreateEscrowProps = {
  offerId: string,
  publicKey: string
}

/**
 * @description Method to create escrow for offer
 * @param offerId offer id
 * @param publicKey Seller public key needed for verifying seller signature for release transaction
 * @returns FundingStatus
 */
export const createEscrow = async ({
  offerId,
  publicKey
}: CreateEscrowProps): Promise<[CreateEscrowResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      publicKey
    })
  })

  return await parseResponse<CreateEscrowResponse>(response, 'createEscrow')
}

type GetFundingStatusProps = {
  offerId: string,
}

/**
 * @description Method to get funding status of offer
 * @param offerId offer id
 * @returns FundingStatus
 */
export const getFundingStatus = async ({
  offerId
}: GetFundingStatusProps): Promise<[FundingStatusResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET',
  })

  return await parseResponse<FundingStatusResponse>(response, 'getFundingStatus')
}

type CancelOfferProps = {
  offerId: string,
  satsPerByte: number|string,
}

/**
 * @description Method to get cancel offer and get refunding information
 * @param offerId offer id
 * @param satsPerByte transaction fees per byte
 * @returns FundingStatus
 */
export const cancelOffer = async ({
  offerId,
  satsPerByte
}: CancelOfferProps): Promise<[CancelOfferResponse|null, APIError|null]> => {
  const response = await fetch(
    `${API_URL}/v1/offer/${offerId}/cancel`,
    {
      headers: {
        Authorization: await getAccessToken(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        satsPerByte,
      }),
    }
  )

  return await parseResponse<CancelOfferResponse>(response, 'refundEscrow')
}

type GetMatchesProps = {
  offerId: string,
}

/**
 * @description Method to get matches of an offer
 * @returns GetOffersResponse
 */
export const getMatches = async ({
  offerId
}: GetMatchesProps): Promise<[GetMatchesResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/matches`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  return await parseResponse<GetMatchesResponse>(response, 'getMatches')
}


type MatchProps = {
  offerId: string,
  matchingOfferId: string,
  currency: Currency,
  paymentMethod: PaymentMethod,
  symmetricKeyEncrypted?: string,
  symmetricKeySignature?: string,
  paymentDataEncrypted?: string,
  paymentDataSignature?: string,
  hashedPaymentData?: string,
}

/**
 * TODO: for KYC, send encrypted (using seller PGP key) KYC data
 * @description Method to match an offer
 * @returns MatchResponse
 */
export const matchOffer = async ({
  offerId,
  currency,
  paymentMethod,
  matchingOfferId,
  symmetricKeyEncrypted,
  symmetricKeySignature,
  paymentDataEncrypted,
  paymentDataSignature,
  hashedPaymentData,
}: MatchProps): Promise<[MatchResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/match`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      matchingOfferId,
      currency,
      paymentMethod,
      symmetricKeyEncrypted,
      symmetricKeySignature,
      paymentDataEncrypted,
      paymentDataSignature,
      hashedPaymentData,
    }),
    method: 'POST'
  })

  return await parseResponse<MatchResponse>(response, 'matchOffer')
}

type UnmatchProps = {
  offerId: string,
  matchingOfferId: string,
}

/**
 * @description Method to match an offer
 * @returns MatchResponse
 */
export const unmatchOffer = async ({
  offerId,
  matchingOfferId
}: UnmatchProps): Promise<[MatchResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/match`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      matchingOfferId
    }),
    method: 'DELETE'
  })

  return await parseResponse<MatchResponse>(response, 'unmatchOffer')
}