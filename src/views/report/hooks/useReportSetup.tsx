import { useContext, useMemo } from 'react'

import { APPVERSION, BUILDNUMBER, UNIQUEID } from '../../../constants'
import LanguageContext from '../../../contexts/language'
import { OverlayContext } from '../../../contexts/overlay'
import { useHeaderSetup, useNavigation, useRoute, useToggleBoolean, useValidatedState } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { showReportSuccess } from '../../../overlays/showReportSuccess'
import { account } from '../../../utils/account'
import { sendErrors } from '../../../utils/analytics'
import i18n from '../../../utils/i18n'
import { sendReport } from '../../../utils/peachAPI'

const emailRules = { email: true, required: true }
const required = { required: true }

export const useReportSetup = () => {
  const route = useRoute<'report'>()
  const navigation = useNavigation()
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const [email, setEmail, isEmailValid, emailErrors] = useValidatedState('', emailRules)
  const [topic, setTopic, isTopicValid, topicErrors] = useValidatedState(route.params.topic || '', required)
  const [message, setMessage, isMessageValid, messageErrors] = useValidatedState(route.params.message || '', required)
  const [shareDeviceID, toggleDeviceIDSharing] = useToggleBoolean(route.params.shareDeviceID || false)
  const [shareLogs, toggleShareLogs] = useToggleBoolean(false)
  const reason = route.params.reason

  const showError = useShowErrorBanner()

  useHeaderSetup(useMemo(() => ({ title: i18n('contact.title') }), []))

  const submit = async () => {
    const isFormValid = isEmailValid && isTopicValid && isMessageValid
    if (!isFormValid) return

    let messageToSend = message
    if (shareDeviceID) messageToSend += `\n\nDevice ID Hash: ${UNIQUEID}`
    messageToSend += `\n\nApp version: ${APPVERSION} (${BUILDNUMBER})`

    if (shareLogs) {
      sendErrors([new Error(`user shared app logs: ${topic} – ${messageToSend}`)])
      messageToSend += '\n\nUser shared app logs, please check crashlytics'
    }

    const [result, err] = await sendReport({
      email,
      reason: i18n(`contact.reason.${reason}`),
      topic,
      message: messageToSend,
    })

    if (result) {
      if (!!account?.publicKey) {
        navigation.navigate('settings')
      } else {
        navigation.navigate('welcome')
      }
      showReportSuccess(updateOverlay)
      return
    }

    if (err) showError()
  }

  return {
    email,
    setEmail,
    isEmailValid,
    emailErrors,
    topic,
    setTopic,
    isTopicValid,
    topicErrors,
    message,
    setMessage,
    isMessageValid,
    messageErrors,
    account,
    toggleDeviceIDSharing,
    shareDeviceID,
    toggleShareLogs,
    shareLogs,
    submit,
  }
}
