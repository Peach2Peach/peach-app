import { CommonActions } from '@react-navigation/native'
import { useCallback } from 'react'
import { usePopupStore } from '../../../../store/usePopupStore'
import { deleteAccount } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { peachAPI } from '../../../../utils/peachAPI'
import { DeleteAccountPopup } from './DeleteAccountPopup'

export const useDeleteAccountPopups = () => {
  const setPopup = usePopupStore((state) => state.setPopup)

  const showPopup = useCallback(
    (content: JSX.Element, callback?: () => void, isSuccess = false) =>
      setPopup({
        visible: true,
        title: i18n(`settings.deleteAccount.${isSuccess ? 'success' : 'popup'}.title`),
        content,
        level: 'ERROR',
        action2:
          !isSuccess && callback
            ? {
              label: i18n('settings.deleteAccount'),
              icon: 'trash',
              callback,
            }
            : undefined,
      }),
    [setPopup],
  )

  const deleteAccountClicked = () => {
    deleteAccount()
    peachAPI.private.user.logoutUser()
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'welcome' }],
    })
    showPopup(<DeleteAccountPopup title={'success'} />, undefined, true)
  }

  const showForRealsiesPopup = () => {
    showPopup(<DeleteAccountPopup title={'forRealsies'} />, deleteAccountClicked)
  }
  const showDeleteAccountPopup = () => {
    showPopup(<DeleteAccountPopup title={'popup'} />, showForRealsiesPopup)
  }

  return showDeleteAccountPopup
}
