import { API_URL } from '@env'
import { error, info } from '../../logUtils'
import { getAccessToken } from './auth'

/**
 * @description Method to get offer of user
 * @returns GetOffersResponse
 */
export const getOffers = async (): Promise<[Offer[]|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  try {
    return [await response.json(), null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - getOffers', e)


    return [null, { error: err }]
  }
}

type PostOfferProps = {
  type: OfferType,
  amount: string,
  premium: number,
  currencies: Currency[],
  paymentMethods: PaymentMethod[],
  hashedPaymentData: string,
  kyc: boolean,
  returnAddress?: string,
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
  hashedPaymentData,
  kyc,
  returnAddress
}: PostOfferProps): Promise<[PostOfferResponse|null, APIError|null]> => {

  try {
    const accessToken = await getAccessToken()
    if (!accessToken) return [null, { error: 'AUTHENTICATION_FAILED' }]

    const response = await fetch(`${API_URL}/v1/offer`, {
      headers: {
        Authorization: accessToken,
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
        hashedPaymentData,
        kyc,
        returnAddress
      })
    })

    return [await response.json(), null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - postOffer', e)

    return [null, { error: err }]
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

  try {
    return [await response.json(), null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - createEscrow', e)


    return [null, { error: err }]
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
}: GetFundingStatusProps): Promise<[FundingStatusResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/escrow`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET',
  })

  try {
    const result = await response.json()

    info('peachAPI - getFundingStatus', result)

    return [await result, null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - getFundingStatus', e)


    return [null, { error: err }]
  }
}


/**
 * @description Method to get offer of user
 * @returns GetOffersResponse
 */
export const getMatches = async ({
  offerId
}: GetFundingStatusProps): Promise<[GetMatchesResponse|null, APIError|null]> => {
  const response = await fetch(`${API_URL}/v1/offer/${offerId}/matches`, {
    headers: {
      Authorization: await getAccessToken(),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })

  try {
    return [await response.json(), null]
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }

    error('peachAPI - getMatches', e)

    return [null, { error: err }]
  }
}