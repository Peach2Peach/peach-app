import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { getErrorsInField } from '../utils/validation/getErrorsInField'
import { Rule } from '../utils/validation/rules'

/**
 * A convenient hook for validated states.
 * @param input the default value of the state
 * @param rulesToCheck
 * @returns an array containing, in that order, the value & setValue, wether the value is valid and its error messages
 *
 * @example
 * const [value, setValue, isValueValid, valueErrors, pristine] = useValidatedState('defaultValue', { required: true })
 *
 * @deprecated the only thing stateful about this is the value, the rest are derived values.
 */
export const useValidatedState = <S extends string | number | undefined>(
  input: S,
  rulesToCheck: Partial<Record<Rule, unknown>>,
): [S, Dispatch<SetStateAction<S>>, boolean, string[] | undefined, boolean] => {
  const [pristine, setPristine] = useState(true)
  const [value, setValue] = useState<S>(input)
  const [isValid, setIsValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string[]>()
  useEffect(() => {
    const errors = getErrorsInField(value, rulesToCheck)
    setIsValid(errors.length === 0)
    setErrorMessage(errors)
    if (value) setPristine(false)
  }, [value, rulesToCheck])

  return [value, setValue, isValid, errorMessage, pristine]
}
