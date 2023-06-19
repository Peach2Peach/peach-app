import { useCallback } from 'react'
import { useShowErrorBanner } from '../useShowErrorBanner'
import { parseError } from '../../utils/result'
import { parseBroadcastError } from '../../views/wallet/helpers/parseBroadcastError'
import { InsufficientFundsError } from '../../utils/wallet/types'

export const useHandleBroadcastError = () => {
  const showErrorBanner = useShowErrorBanner()

  const handleBroadcastError = useCallback(
    (e: unknown) => {
      const [err, cause] = e as [Error, string | InsufficientFundsError]
      const error = parseError(err)
      const bodyArgs = parseBroadcastError(err, cause)
      showErrorBanner(error, bodyArgs)
    },
    [showErrorBanner],
  )
  return handleBroadcastError
}
