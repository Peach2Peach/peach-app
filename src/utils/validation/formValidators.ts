import { messages } from './messages'
import { Rule, rules } from './rules'

/**
 * A function to validate a value against rules
 * @param value the value to be checked
 * @param rulesToCheck the rules to validate this value agains
 * @returns wether or not there are any errors
 */
export const isFieldInError = (value: string, rulesToCheck: Partial<Record<Rule, boolean | undefined>>) => {
  const hasErrors = (Object.keys(rulesToCheck) as Rule[]).some((key) => {
    if (rulesToCheck[key]) {
      const ruleToCheck = rules[key] as RegExp | ((x: unknown, y: unknown) => boolean)
      const isRuleFn = typeof ruleToCheck === 'function'
      const isRegExp = ruleToCheck instanceof RegExp
      if ((isRuleFn && !ruleToCheck(rulesToCheck[key], value)) || (isRegExp && !ruleToCheck.test(value))) {
        return true
      }
    }
    return false
  })

  return hasErrors
}

/**
 * A simple function to retrieve all error messages that apply to a value
 *
 * @param value the value to be checked
 * @param rulesToCheck the rules to apply to this value
 * @returns an array of error messages, or an empty array if none exists
 */
export const getErrorsInField = (value: string, rulesToCheck: Partial<Record<Rule, boolean | undefined>>) => [
  ...(Object.keys(rulesToCheck) as Rule[])
    .filter((key) => {
      if (rulesToCheck[key]) {
        const ruleToCheck = rules[key] as RegExp | ((x: unknown, y: unknown) => boolean)
        const isRuleFn = typeof ruleToCheck === 'function'
        const isRegExp = ruleToCheck instanceof RegExp
        if ((isRuleFn && !ruleToCheck(rulesToCheck[key], value)) || (isRegExp && !ruleToCheck.test(value))) {
          return true
        }
      }
      return false
    })
    .map((key) => messages[key]),
]

/**
 *
 * @param config an array of objects each consisting of both the value to check and the rules to apply to this value
 * @returns wether the form is valid or not
 *
 * @example
 * validateForm([{ value: bitcoinAddress, rulesToCheck: { bitcoinAddress: true, required: true }}])
 */
export const validateForm = (config: { value: string; rulesToCheck: Partial<Record<Rule, boolean | undefined>> }[]) =>
  config.some(({ value, rulesToCheck }) => !isFieldInError(value, rulesToCheck))
