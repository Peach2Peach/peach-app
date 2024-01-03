import { useMemo } from 'react'
import { useToggleBoolean } from '../../hooks/useToggleBoolean'
import { Input, InputProps } from './Input'

export function PasswordInput (props: InputProps) {
  const [showSecret, toggleShowSecret] = useToggleBoolean()

  const inputIcons = useMemo(
    () => (props.icons || []).concat([showSecret ? 'eyeOff' : 'eye', toggleShowSecret]),
    [props.icons, showSecret, toggleShowSecret],
  )
  return <Input {...props} icons={inputIcons} secureTextEntry={!showSecret} />
}
