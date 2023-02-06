import { useEffect, useRef, useState } from 'react'

export const useOnUnmount = <T>(callback: (val: T) => void, dep: T) => {
  const [value] = useState(dep)
  const valueRef = useRef(value)

  useEffect(() => {
    valueRef.current = dep
  }, [dep])

  useEffect(
    () => () => {
      console.log(callback.toString(), valueRef.current)
      callback(valueRef.current)
    },
    [callback],
  )
}
