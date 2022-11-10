import { useState, useEffect } from 'react'
import { getErrorsInField } from './formValidators'
import { Rule } from './rules'

/**
 * A convenient hook for validated states.
 * @param input the default value of the state
 * @param rulesToCheck
 * @returns an array containing, in that order, the value & setValue, wether the value is valid and its error messages
 */
export const useValidatedState = (
  input: string,
  rulesToCheck: Partial<Record<Rule, boolean | undefined>>,
): [string, React.Dispatch<React.SetStateAction<string>>, boolean, string[] | undefined] => {
  const [value, setValue] = useState<string>(input)
  const [isValid, setIsValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string[]>()
  useEffect(() => {
    const errors = getErrorsInField(value, rulesToCheck)
    setIsValid(errors.length === 0)
    setErrorMessage(errors)
  }, [value, rulesToCheck])

  return [value, setValue, isValid, errorMessage]
}
