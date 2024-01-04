import { useCallback } from 'react'
import { PopupAction } from '../../../../components/popup'
import { ErrorPopup } from '../../../../popups/ErrorPopup'
import { ClosePopupAction } from '../../../../popups/actions'
import { usePopupStore } from '../../../../store/usePopupStore'
import tw from '../../../../styles/tailwind'
import { useAccountStore } from '../../../../utils/account/account'
import { deleteAccount } from '../../../../utils/account/deleteAccount'
import i18n from '../../../../utils/i18n'
import { peachAPI } from '../../../../utils/peachAPI'
import { DeleteAccountPopup } from './DeleteAccountPopup'

export const useDeleteAccountPopups = () => {
  const setPopup = usePopupStore((state) => state.setPopup)
  const setIsLoggedIn = useAccountStore((state) => state.setIsLoggedIn)

  const showPopup = useCallback(
    (content: JSX.Element, callback?: () => void, isSuccess = false) =>
      setPopup(
        <ErrorPopup
          title={i18n(`settings.deleteAccount.${isSuccess ? 'success' : 'popup'}.title`)}
          content={content}
          actions={
            <>
              {!isSuccess && callback && (
                <PopupAction label={i18n('settings.deleteAccount')} iconId="trash" onPress={callback} />
              )}
              <ClosePopupAction reverseOrder style={!(!isSuccess && callback) && tw`justify-center`} />
            </>
          }
        />,
      ),
    [setPopup],
  )

  const deleteAccountClicked = () => {
    deleteAccount()
    peachAPI.private.user.logoutUser()
    setIsLoggedIn(false)
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
