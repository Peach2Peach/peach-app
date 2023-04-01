import { useDeleteAccountPopups } from './useDeleteAccountPopups'
import { act, renderHook } from '@testing-library/react-native'
import { OverlayContext, defaultOverlay } from '../../../../contexts/overlay'
import { deleteAccount } from '../../../../utils/account'
import { logoutUser } from '../../../../utils/peachAPI'
import { CommonActions } from '@react-navigation/native'
import { DeleteAccountPopup } from './DeleteAccountPopup'
import i18n from '../../../../utils/i18n'

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
  let defaultOverlayMock = { ...defaultOverlay }
  const updateOverlayMock = jest.fn((props) => (defaultOverlayMock = { ...defaultOverlayMock, ...props }))
  const { result } = renderHook(useDeleteAccountPopups, {
    wrapper: ({ children }) => (
      <OverlayContext.Provider value={[defaultOverlayMock, updateOverlayMock]}>{children}</OverlayContext.Provider>
    ),
  })
  it('should show deleteAccount ovelay', () => {
    act(() => {
      result.current()
    })
    expect(defaultOverlayMock).toStrictEqual({
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
      defaultOverlayMock.action2?.callback()
    })
    expect(defaultOverlayMock).toStrictEqual({
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
      defaultOverlayMock.action2?.callback()
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
    expect(defaultOverlayMock).toStrictEqual({
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
