import { useState, useCallback } from 'react'
import { messages } from './messages'
import { Rule, rules } from './rules'

// eslint-disable-next-line max-lines-per-function
export const useValidation = (state: { [key: string]: unknown }) => {
  const [errors, setErrors] = useState<{ fieldName: string; failedRules: string[]; messages: any[] }[]>([])

  const isFormValid = useCallback(() => errors.length === 0, [errors.length])

  const _addError = useCallback((fieldName: string, rule: Rule, value?: boolean) => {
    const errMsg = messages[rule]
    setErrors((prev) => {
      const [error] = prev.filter((err) => err.fieldName === fieldName)

      if (error) {
        const index = prev.indexOf(error)
        error.messages.push(errMsg)
        error.failedRules.push(rule)
        return [...prev.slice(0, index), error, ...prev.slice(index + 1)]
      }
      return [...prev, { fieldName, failedRules: [rule], messages: [errMsg] }]
    })
  }, [])

  const _checkRules = useCallback(
    (fieldName: string, rulesToCheck: { [x: string]: boolean | undefined; required?: any }, value: any) => {
      if (!value && !rulesToCheck.required) {
        return
      }

      for (const key of Object.keys(rulesToCheck) as Rule[]) {
        const ruleToCheck = rules[key] as RegExp | ((x: unknown, y: unknown) => boolean)
        const isRuleFn = typeof ruleToCheck === 'function'
        const isRegExp = ruleToCheck instanceof RegExp
        if ((isRuleFn && !ruleToCheck(rulesToCheck[key], value)) || (isRegExp && !ruleToCheck.test(value))) {
          _addError(fieldName, key, rulesToCheck[key])
        }
      }
    },
    [_addError],
  )

  const validate = useCallback(
    (fields: { [x: string]: { [rule: string]: boolean | undefined } }) => {
      setErrors([])
      for (const key of Object.keys(state)) {
        const rulesToCheck = fields[key]
        if (rulesToCheck) {
          _checkRules(key, rulesToCheck, state[key])
        }
      }
      return isFormValid()
    },
    [_checkRules, isFormValid, state],
  )

  const isFieldInError = useCallback(
    (fieldName: string) => errors.filter((err) => err.fieldName === fieldName).length > 0,
    [errors],
  )

  const getErrorsInField = useCallback(
    (fieldName: string) => {
      const foundError = errors.find((err) => err.fieldName === fieldName)
      if (!foundError) {
        return []
      }
      return foundError.messages
    },
    [errors],
  )

  return {
    validate,
    isFormValid,
    isFieldInError,
    getErrorsInField,
  }
}
