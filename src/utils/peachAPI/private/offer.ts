import { API_URL } from '@env'
import { Authorization } from '..'
import { getAccessToken } from './auth'

/**
 * @description Method to get offer of user
 * @returns GetOffersResponse
 */
export const getOffers = async (): Promise<[Offer[]|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer`, {
    headers: {
      Authorization,
      accestoken: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  try {
    return [await response.json(), null]
  } catch (e) {
    let error = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      error = e.toUpperCase()
    } else if (e instanceof Error) {
      error = e.message
    }

    return [null, { error }]
  }
}

type PostOfferProps = {
  type: OfferType,
  amount: string,
  premium: number,
  currencies: Currency[],
  paymentMethods: PaymentMethod[],
  kyc: boolean,
  returnAddress: string,
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
  returnAddress
}: PostOfferProps): Promise<[PostOfferResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer`, {
    headers: {
      Authorization,
      accestoken: await getAccessToken(),
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
      returnAddress
    })
  })

  try {
    return [await response.json(), null]
  } catch (e) {
    let error = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      error = e.toUpperCase()
    } else if (e instanceof Error) {
      error = e.message
    }

    return [null, { error }]
  }
}

type CreateEscrowProps = {
  offerId: number,
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
}: CreateEscrowProps): Promise<[FundingStatus|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow`, {
    headers: {
      Authorization,
      accestoken: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      publicKey
    })
  })

  try {
    return [await response.json(), null]
  } catch (e) {
    let error = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      error = e.toUpperCase()
    } else if (e instanceof Error) {
      error = e.message
    }

    return [null, { error }]
  }
}


type GetFundingStatusProps = {
  offerId: number,
}

/**
 * @description Method to get funding status of offer
 * @param offerId offer id
 * @returns FundingStatus
 */
export const getFundingStatus = async ({
  offerId
}: GetFundingStatusProps): Promise<[FundingStatus|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow`, {
    headers: {
      Authorization,
      accestoken: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET',
  })

  try {
    return [await response.json(), null]
  } catch (e) {
    let error = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      error = e.toUpperCase()
    } else if (e instanceof Error) {
      error = e.message
    }

    return [null, { error }]
  }
}