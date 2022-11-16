import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { unique } from '../utils/array'
import { error, info } from '../utils/log'
import { getMatches } from '../utils/peachAPI'

export default (
  offer: SellOffer | BuyOffer,
  page: number,
  setSearchingMatches: React.Dispatch<React.SetStateAction<boolean>>,
  offerId: string | undefined,
  route: RouteProp<
    {
      params: RootStackParamList['search']
    },
    'params'
  >,
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>,
  updateMessage: (value: MessageState) => void,
  pnReceived: number,
  // eslint-disable-next-line max-params
) =>
  useFocusEffect(
    useCallback(() => {
      const checkingInterval = 15 * 1000

      const checkingFunction = async () => {
        if (!offer?.id) return
        if (offer.doubleMatched) return
        if (offer.type === 'ask' && (!offer.funding || offer.funding.status !== 'FUNDED')) return
        setSearchingMatches(true)

        info('Checking matches for', offer.id)

        const [result, err] = await getMatches({
          offerId: offer.id,
          page,
          size: 10,
          timeout: checkingInterval,
        })

        if (result) {
          info('matches: ', result.matches.length)

          setSearchingMatches(false)
          if (offerId === route.params.offer.id) {
            setMatches((ms) =>
              ms
                .concat(result.matches)
                .filter(unique('offerId'))
                .map((match) => {
                  const update = result.matches.find((m) => m.offerId === match.offerId)
                  match.prices = (update || match).prices
                  return match
                }),
            )
          }
        } else if (err) {
          error('Error', err)
          setSearchingMatches(false)
          if (err.error !== 'UNAUTHORIZED') updateMessage({ msgKey: err.error, level: 'ERROR' })
        }
      }

      const interval = setInterval(checkingFunction, checkingInterval)
      checkingFunction()

      return () => {
        clearInterval(interval)
      }
    }, [offerId, pnReceived, page]),
  )
