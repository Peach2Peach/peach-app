import { info, error } from '../../utils/log'
import { getMatches } from '../../utils/peachAPI'

const PAGESIZE = 10
export const getMatchesFn = async ({ queryKey, pageParam = 0 }: { queryKey: [string, string]; pageParam?: number }) => {
  const [, offerId] = queryKey

  info('Checking matches for', offerId)
  const [result, err] = await getMatches({
    offerId,
    page: pageParam,
    size: PAGESIZE,
    timeout: 30 * 1000,
  })

  if (result) {
    info('matches: ', result.matches.length)
    return result
  } else if (err) {
    error('Error', err)
    throw err
  }
  throw new Error()
}
