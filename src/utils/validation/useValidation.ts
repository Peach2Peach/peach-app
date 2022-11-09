import { getMessages } from './messages'
import { rules } from './rules'

const { useValidation: useFormValidation } = require('react-native-form-validator')

export const useValidation = (state: object) => {
  const validationHelpers = useFormValidation({
    deviceLocale: 'default',
    state,
    rules,
    messages: getMessages(),
  })
  return validationHelpers
}
