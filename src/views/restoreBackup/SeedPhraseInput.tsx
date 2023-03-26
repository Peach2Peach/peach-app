import { Dispatch, ReactElement, SetStateAction, useCallback } from 'react';
import { Input } from '../../components'
import { useValidatedState } from '../../hooks'
import { bip39WordRules } from './hooks/useRestoreFromSeedSetup'

type Props = ComponentProps & { index: number; setWords: Dispatch<SetStateAction<string[]>> }

export const SeedPhraseInput = ({ style, index, setWords }: Props): ReactElement => {
  const [word, setWord, , errorMessage] = useValidatedState<string>('', bip39WordRules)
  const onChange = useCallback(
    (value: string) => {
      setWord(value)
      setWords((words: string[]) => {
        const newWords = [...words]
        newWords[index] = value
        return newWords
      })
    },
    [index, setWord, setWords],
  )
  return (
    <Input
      theme="inverted"
      onChange={onChange}
      onSubmit={onChange}
      errorMessage={errorMessage}
      placeholder={`${index + 1}.`}
      value={word}
      style={style}
    />
  )
}
