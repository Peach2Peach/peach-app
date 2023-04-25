import { getMessages } from './messages'
import { Rule, rules } from './rules'

/**
 * A simple function to retrieve all error messages that apply to a value
 *
 * @param value the value to be checked
 * @param rulesToCheck the rules to apply to this value
 * @returns an array of error messages, or an empty array if none exist
 *
 * @example
 * getErrorsInField(bitcoinAddress, rulesToCheck: { bitcoinAddress: true, required: true })
 */
export const getErrorsInField = (value: string | number | undefined, rulesToCheck: Partial<Record<Rule, any>>) =>
  !value && rulesToCheck.required === false
    ? []
    : [
      ...(Object.keys(rulesToCheck) as Rule[])
        .filter((key) => {
          if (rulesToCheck[key]) {
            const ruleToCheck = rules[key] as RegExp | ((x: unknown, y: unknown) => boolean)
            const isRuleFn = typeof ruleToCheck === 'function'
            const isRegExp = ruleToCheck instanceof RegExp
            if (
              (isRuleFn && !ruleToCheck(rulesToCheck[key], value))
                || (isRegExp && !ruleToCheck.test(String(value)))
            ) {
              return true
            }
          }
          return false
        })
        .map((key) => getMessages()[key]),
    ]
