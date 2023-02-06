import { useEffect, useRef, useState } from 'react'

export const useOnUnmount = <T>(callback: (val: T) => void, dep: T) => {
  const [value] = useState(dep)
  const valueRef = useRef(value)

  useEffect(() => {
    valueRef.current = dep
  }, [dep])

  useEffect(
    () => () => {
      callback(valueRef.current)
    },
    [callback],
  )
}
