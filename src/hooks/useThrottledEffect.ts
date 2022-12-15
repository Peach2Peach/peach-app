import { useEffect, useRef } from 'react'

export const useThrottledEffect = (callback: Function, delay: number, deps: any[] = []) => {
  const lastRan = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        callback()
        lastRan.current = Date.now()
      }
    }, delay - (Date.now() - lastRan.current))

    return () => {
      clearTimeout(handler)
    }
  }, [callback, delay, ...deps])
}
