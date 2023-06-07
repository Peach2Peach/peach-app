import { CommonActions } from '@react-navigation/native'
import { act, renderHook } from '@testing-library/react-native'
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

jest.mock('@react-navigation/native', () => ({
  CommonActions: {
    reset: jest.fn(),
  },
}))

describe('useDeleteAccountPopups', () => {
  const { result } = renderHook(useDeleteAccountPopups)

  it('should show deleteAccount ovelay', () => {
    act(() => {
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

  it('should show forRealsies ovelay', () => {
    act(() => {
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

  it('should delete the account', () => {
    act(() => {
      usePopupStore.getState().action2?.callback()
    })
    expect(deleteAccount).toHaveBeenCalledTimes(1)
  })

  it('should logout the user', () => {
    expect(logoutUser).toHaveBeenCalledTimes(1)
  })

  it('should reset the navigation', () => {
    expect(CommonActions.reset).toHaveBeenCalledTimes(1)
  })

  it('should show success ovelay', () => {
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
