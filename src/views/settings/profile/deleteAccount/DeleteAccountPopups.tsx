import { CommonActions } from '@react-navigation/native'
import React, { useCallback, useContext } from 'react'

import { Text } from '../../../../components'
import { OverlayContext } from '../../../../contexts/overlay'
import { deleteAccount } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'

const DeleteAccountPopup = ({ title }: { title: 'popup' | 'forRealsies' | 'success' }) => (
  <Text>{i18n(`settings.deleteAccount.${title}`)}</Text>
)

export const useDeleteAccountPopups = () => {
  const [, updateOverlay] = useContext(OverlayContext)

  const showOverlay = useCallback(
    (content: JSX.Element, callback?: () => void, isSuccess = false) =>
      updateOverlay({
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
    [updateOverlay],
  )

  const deleteAccountClicked = async () => {
    await deleteAccount()
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'welcome' }],
    })
    showOverlay(<DeleteAccountPopup title={'success'} />, undefined, true)
  }

  const showForRealsiesOverlay = () => {
    showOverlay(<DeleteAccountPopup title={'forRealsies'} />, deleteAccountClicked)
  }
  const showDeleteAccountOverlay = () => {
    showOverlay(<DeleteAccountPopup title={'popup'} />, showForRealsiesOverlay)
  }

  return showDeleteAccountOverlay
}
