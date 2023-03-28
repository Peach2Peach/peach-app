import { useEffect } from 'react'

export const useDebounce = (value: any, callback: Function, delay: number) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, callback, delay])
}
