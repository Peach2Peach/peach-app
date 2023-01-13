import React, { useMemo } from 'react'

import shallow from 'zustand/shallow'
import { HelpIcon } from '../../../components/icons'
import { useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'

export const useWalletSettingsSetup = () => {
  const [nodeURL, setNodeURL] = useSettingsStore((state) => [state.nodeURL, state.setNodeURL], shallow)
  const showHelp = useShowHelp('useYourOwnNode')

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('settings.walletSettings'),
        icons: [{ iconComponent: <HelpIcon />, onPress: showHelp }],
      }),
      [showHelp],
    ),
  )

  return {
    nodeURL,
    setNodeURL,
  }
}
