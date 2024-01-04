import { act, fireEvent, render, renderHook } from 'test-utils'
import { Popup, PopupAction } from '../../../../components/popup'
import { ErrorPopup } from '../../../../popups/ErrorPopup'
import { ClosePopupAction } from '../../../../popups/actions'
import { usePopupStore } from '../../../../store/usePopupStore'
import { useAccountStore } from '../../../../utils/account/account'
import { deleteAccount } from '../../../../utils/account/deleteAccount'
import i18n from '../../../../utils/i18n'
import { peachAPI } from '../../../../utils/peachAPI'
import { DeleteAccountPopup } from './DeleteAccountPopup'
import { useDeleteAccountPopups } from './useDeleteAccountPopups'

jest.mock('../../../../utils/account/deleteAccount', () => ({
  deleteAccount: jest.fn(),
}))

const logoutUser = jest.spyOn(peachAPI.private.user, 'logoutUser')

describe('useDeleteAccountPopups', () => {
  const logout = async () => {
    const { getByText } = render(<Popup />)
    await act(() => {
      fireEvent.press(getByText(i18n('settings.deleteAccount')))
    })
    await act(() => {
      fireEvent.press(getByText(i18n('settings.deleteAccount')))
    })
  }
  it('should show deleteAccount popup', async () => {
    const { result } = renderHook(useDeleteAccountPopups)
    await act(() => {
      result.current()
    })

    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <ErrorPopup
        title={i18n('settings.deleteAccount.popup.title')}
        content={<DeleteAccountPopup title={'popup'} />}
        actions={
          <>
            <PopupAction label={i18n('settings.deleteAccount')} iconId="trash" onPress={expect.any(Function)} />
            <ClosePopupAction reverseOrder style={false} />
          </>
        }
      />,
    )
  })

  it('should show forRealsies popup', async () => {
    const { result } = renderHook(useDeleteAccountPopups)
    await act(() => {
      result.current()
    })
    const { getByText } = render(<Popup />)
    await act(() => {
      fireEvent.press(getByText(i18n('settings.deleteAccount')))
    })
    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <ErrorPopup
        title={i18n('settings.deleteAccount.popup.title')}
        content={<DeleteAccountPopup title={'forRealsies'} />}
        actions={
          <>
            <PopupAction label={i18n('settings.deleteAccount')} iconId="trash" onPress={expect.any(Function)} />
            <ClosePopupAction reverseOrder style={false} />
          </>
        }
      />,
    )
  })

  it('should delete the account', async () => {
    const { result } = renderHook(useDeleteAccountPopups)
    await act(() => {
      result.current()
    })

    await logout()
    expect(deleteAccount).toHaveBeenCalledTimes(1)
  })

  it('should logout the user', async () => {
    const { result } = renderHook(useDeleteAccountPopups)
    await act(() => {
      result.current()
    })
    await logout()
    expect(logoutUser).toHaveBeenCalledTimes(1)
  })

  it('should update the login state', async () => {
    const { result } = renderHook(useDeleteAccountPopups)
    await act(() => {
      result.current()
    })
    await logout()
    expect(useAccountStore.getState().isLoggedIn).toEqual(false)
  })

  it('should show success ovelay', async () => {
    const { result } = renderHook(useDeleteAccountPopups)
    await act(() => {
      result.current()
    })
    await logout()

    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <ErrorPopup
        title={i18n('settings.deleteAccount.success.title')}
        content={<DeleteAccountPopup title="success" />}
        actions={
          <>
            {false}
            <ClosePopupAction
              reverseOrder={true}
              style={{
                justifyContent: 'center',
              }}
            />
          </>
        }
      />,
    )
  })
})
