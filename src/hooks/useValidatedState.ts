import { useState, useEffect } from 'react'
import { getErrorsInField } from '../utils/validation/getErrorsInField'
import { Rule } from '../utils/validation/rules'

/**
 * A convenient hook for validated states.
 * @param input the default value of the state
 * @param rulesToCheck
 * @returns an array containing, in that order, the value & setValue, wether the value is valid and its error messages
 *
 * @example
 * const [value, setValue, isValueValid, valueErrors] = useValidatedState('defaultValue', { required: true })
 */
export const useValidatedState = <S extends string | number>(
  input: S,
  rulesToCheck: Partial<Record<Rule, boolean | number | undefined>>,
): [S, React.Dispatch<React.SetStateAction<S>>, boolean, string[] | undefined] => {
  const [value, setValue] = useState<S>(input)
  const [isValid, setIsValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string[]>()
  useEffect(() => {
    const errors = getErrorsInField(value, rulesToCheck)
    setIsValid(errors.length === 0)
    setErrorMessage(errors)
  }, [value, rulesToCheck])

  return [value, setValue, isValid, errorMessage]
}
