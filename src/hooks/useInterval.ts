import { useEffect, useRef } from 'react'

type Props = {
  callback: () => void
  interval: number | null
}

export const useInterval = ({ callback, interval }: Props) => {
  const savedCallback = useRef<Props['callback']>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = () => savedCallback.current?.()

    if (interval !== null) {
      const intervalId = setInterval(tick, interval)
      return () => clearInterval(intervalId)
    }
    return () => null
  }, [interval])
}
