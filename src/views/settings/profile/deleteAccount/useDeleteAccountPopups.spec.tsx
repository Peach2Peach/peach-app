import { act, renderHook } from 'test-utils'
import { resetMock } from '../../../../../tests/unit/helpers/NavigationWrapper'
import { usePopupStore } from '../../../../store/usePopupStore'
import { deleteAccount } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { logoutUser } from '../../../../utils/peachAPI'
import { DeleteAccountPopup } from './DeleteAccountPopup'
import { useDeleteAccountPopups } from './useDeleteAccountPopups'

jest.mock('../../../../utils/account', () => ({
  deleteAccount: jest.fn(),
}))

jest.mock('../../../../utils/peachAPI', () => ({
  logoutUser: jest.fn(),
}))

describe('useDeleteAccountPopups', () => {
  const logout = async () => {
    await act(() => {
      usePopupStore.getState().action2?.callback()
    })
    await act(() => {
      usePopupStore.getState().action2?.callback()
    })
  }
  it('should show deleteAccount ovelay', async () => {
    const { result } = renderHook(useDeleteAccountPopups)
    await act(() => {
      result.current()
    })
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      visible: true,
      title: i18n('settings.deleteAccount.popup.title'),
      content: <DeleteAccountPopup title={'popup'} />,
      level: 'ERROR',
      requireUserAction: false,
      action1: undefined,
      action2: {
        label: i18n('settings.deleteAccount'),
        icon: 'trash',
        callback: expect.any(Function),
      },
    })
  })

  it('should show forRealsies ovelay', async () => {
    const { result } = renderHook(useDeleteAccountPopups)
    await act(() => {
      result.current()
    })
    await act(() => {
      usePopupStore.getState().action2?.callback()
    })
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      visible: true,
      title: i18n('settings.deleteAccount.popup.title'),
      content: <DeleteAccountPopup title={'forRealsies'} />,
      level: 'ERROR',
      requireUserAction: false,
      action1: undefined,
      action2: {
        label: i18n('settings.deleteAccount'),
        icon: 'trash',
        callback: expect.any(Function),
      },
    })
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

  it('should reset the navigation', async () => {
    const { result } = renderHook(useDeleteAccountPopups)
    await act(() => {
      result.current()
    })
    await logout()
    expect(resetMock).toHaveBeenCalledTimes(1)
  })

  it('should show success ovelay', async () => {
    const { result } = renderHook(useDeleteAccountPopups)
    await act(() => {
      result.current()
    })
    await logout()

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      visible: true,
      title: i18n('settings.deleteAccount.success.title'),
      content: <DeleteAccountPopup title={'success'} />,
      level: 'ERROR',
      requireUserAction: false,
      action1: undefined,
      action2: undefined,
    })
  })
})
