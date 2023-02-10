import { useEffect, useRef, useState } from 'react'

/**
 * @description Use this method if you need to perform an expensive action
 * which you can use in a regular `useEffect` hook
 */
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
