import React, { useContext, useMemo } from 'react'
import { HelpIcon } from '../../../components/icons'
import { OverlayContext } from '../../../contexts/overlay'

import { useHeaderSetup, useNavigation } from '../../../hooks'
import NetworkFees from '../../../overlays/info/NetworkFees'
import i18n from '../../../utils/i18n'

export const useNetworkFeesSetup = () => {
  const [, updateOverlay] = useContext(OverlayContext)
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
}
