import { useNavigation, useRoute, useToggleBoolean, useValidatedState } from '../../../hooks'
import { useShowAppPopup } from '../../../hooks/useShowAppPopup'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { submitReport } from '../helpers/submitReport'

const emailRules = { email: true, required: true }
const required = { required: true }

export const useReportSetup = () => {
  const route = useRoute<'report'>()
  const navigation = useNavigation()
  const showReportSuccess = useShowAppPopup('reportSuccess')
  const [email, setEmail, isEmailValid, emailErrors] = useValidatedState<string>('', emailRules)
  const [topic, setTopic, isTopicValid, topicErrors] = useValidatedState(route.params.topic || '', required)
  const [message, setMessage, isMessageValid, messageErrors] = useValidatedState(route.params.message || '', required)
  const [shareDeviceID, toggleDeviceIDSharing] = useToggleBoolean(route.params.shareDeviceID || false)
  const [shareLogs, toggleShareLogs] = useToggleBoolean(false)
  const reason = route.params.reason

  const showError = useShowErrorBanner()

  const submit = async () => {
    const isFormValid = isEmailValid && isTopicValid && isMessageValid
    if (!isFormValid) return

    const [result, err] = await submitReport({
      email,
      reason: i18n(`contact.reason.${reason}`),
      topic,
      message,
      shareDeviceID,
      shareLogs,
    })

    if (result) {
      if (account?.publicKey) {
        navigation.navigate('settings')
      } else {
        navigation.navigate('welcome')
      }
      showReportSuccess()
      return
    }

    if (err) showError()
  }

  return {
    reason,
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
    shareDeviceID,
    toggleDeviceIDSharing,
    shareLogs,
    toggleShareLogs,
    submit,
  }
}
