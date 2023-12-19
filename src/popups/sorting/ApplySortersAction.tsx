import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { PopupAction } from '../../components/popup'
import { usePopupStore } from '../../store/usePopupStore'
import i18n from '../../utils/i18n'

export function ApplySortersAction ({ setSorterAction }: { setSorterAction: () => void }) {
  const queryClient = useQueryClient()
  const closePopup = usePopupStore((state) => state.closePopup)

  const applySorters = useCallback(() => {
    setSorterAction()
    queryClient.invalidateQueries({ queryKey: ['matches'] })
    closePopup()
  }, [closePopup, queryClient, setSorterAction])

  return <PopupAction onPress={applySorters} label={i18n('apply')} iconId={'checkSquare'} reverseOrder />
}
