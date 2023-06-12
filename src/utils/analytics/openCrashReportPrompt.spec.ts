import { Alert, Linking } from 'react-native'
import { openCrashReportPrompt } from '.'
import { deleteUnsentReports } from './deleteUnsentReports'
import { sendErrors } from './sendErrors'

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  Linking: {
    openURL: jest.fn(),
  },
}))
jest.mock('./deleteUnsentReports', () => ({
  ...jest.requireActual('./deleteUnsentReports'),
  deleteUnsentReports: jest.fn(),
}))
jest.mock('./sendErrors', () => ({
  sendErrors: jest.fn(),
}))

describe('openCrashReportPrompt function', () => {
  const errors = [new Error('Test error 1'), new Error('Test error 2')]

  it('should call the Alert.alert method with the correct parameters', () => {
    openCrashReportPrompt(errors)
    expect(Alert.alert).toHaveBeenCalledWith(expect.any(String), expect.any(String), [
      expect.objectContaining({ text: expect.any(String), onPress: expect.any(Function), style: 'default' }),
      expect.objectContaining({ text: expect.any(String), onPress: deleteUnsentReports, style: 'default' }),
      expect.objectContaining({ text: expect.any(String), onPress: expect.any(Function), style: 'default' }),
    ])
  })

  it('should call the Linking.openURL method when the privacy policy button is pressed', () => {
    openCrashReportPrompt(errors)
    ;(Alert.alert as jest.Mock).mock.calls[0][2][0].onPress()
    expect(Linking.openURL).toHaveBeenCalledWith('https://www.peachbitcoin.com/privacyPolicy.html')
  })

  it('should call the sendErrors function when the send report button is pressed', () => {
    openCrashReportPrompt(errors)
    ;(Alert.alert as jest.Mock).mock.calls[0][2][2].onPress()
    expect(sendErrors).toHaveBeenCalledWith(errors)
  })
})
