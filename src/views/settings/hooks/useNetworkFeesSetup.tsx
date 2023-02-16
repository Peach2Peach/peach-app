import React, { useEffect, useMemo, useState } from 'react'
import { HelpIcon } from '../../../components/icons'
import getFeeEstimateEffect from '../../../effects/getFeeEstimateEffect'

import { useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import i18n from '../../../utils/i18n'

export const useNetworkFeesSetup = () => {
  const showHelp = useShowHelp('networkFees')
  const [estimatedFees, setEstimatedFees] = useState<FeeRecommendation>({
    fastestFee: 1,
    halfHourFee: 1,
    hourFee: 1,
    economyFee: 1,
    minimumFee: 1,
  })
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('settings.networkFees'),
        icons: [
          {
            iconComponent: <HelpIcon />,
            onPress: showHelp,
          },
        ],
      }),
      [showHelp],
    ),
  )

  useEffect(
    getFeeEstimateEffect({
      interval: 60 * 1000,
      onSuccess: (result) => {
        setEstimatedFees(result)
      },
    }),
    [],
  )

  return {
    estimatedFees,
  }
}
