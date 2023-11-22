import { keys } from '../object'
import { getMessages } from './messages'
import { Rule, rules } from './rules'

type RuleRecord = {
  [K in Rule]?: boolean
}

export const getErrorsInField = (value: string, rulesToCheck: RuleRecord) =>
  !value && rulesToCheck.required === false
    ? []
    : [
      ...keys(rulesToCheck)
        .filter((key) => rulesToCheck[key] && !rules[key](value))
        .map((key) => getMessages()[key]),
    ]
