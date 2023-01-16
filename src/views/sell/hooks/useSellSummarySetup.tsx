import { useMemo } from 'react'

import { useHeaderSetup } from '../../../hooks'
import i18n from '../../../utils/i18n'

export const useSellSummarySetup = () => {
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('sell.summary.title'),
      }),
      [],
    ),
  )

  return {}
}
