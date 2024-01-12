import { useMemo } from 'react'
import { useToggleBoolean } from '../../hooks/useToggleBoolean'
import { IconActionPair, Input, InputProps } from './Input'

export function PasswordInput ({ icons = [], ...props }: InputProps) {
  const [showSecret, toggleShowSecret] = useToggleBoolean()

  const inputIcons: IconActionPair[] = useMemo(
    () => [...icons, [showSecret ? 'eyeOff' : 'eye', toggleShowSecret]],
    [icons, showSecret, toggleShowSecret],
  )
  return <Input {...props} icons={inputIcons} secureTextEntry={!showSecret} />
}
