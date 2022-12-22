import React, { useContext, useEffect, useMemo, useState } from 'react'
import { HelpIcon } from '../../../components/icons'
import { OverlayContext } from '../../../contexts/overlay'
import getFeeEstimateEffect from '../../../effects/getFeeEstimateEffect'

import { useHeaderSetup, useNavigation } from '../../../hooks'
import NetworkFees from '../../../overlays/info/NetworkFees'
import i18n from '../../../utils/i18n'

export const useNetworkFeesSetup = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [estimatedFees, setEstimatedFees] = useState<FeeRecommendation>({
    fastestFee: 1,
    halfHourFee: 1,
    hourFee: 1,
    economyFee: 1,
    minimumFee: 1,
  })
  const navigation = useNavigation()
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('settings.networkFees'),
        icons: [
          {
            iconComponent: <HelpIcon />,
            onPress: () =>
              updateOverlay({
                title: i18n('help.networkFees.title'),
                content: <NetworkFees />,
                visible: true,
                action2: {
                  callback: () => {
                    updateOverlay({ visible: false })
                    navigation.navigate('contact')
                  },
                  label: i18n('help'),
                  icon: 'alertCircle',
                },
                level: 'INFO',
              }),
          },
        ],
      }),
      [],
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
