import { useEffect, useState } from "react";

export const useInterruptibleFunction = (
  fn: () => void,
  delay: number,
): { interruptibleFn: () => void; interrupt: () => void } => {
  const [interrupted, setInterrupted] = useState(false);
  const [interruptFn, setInterruptFn] = useState<null | (() => () => void)>(
    null,
  );

  useEffect(() => {
    if (interrupted) {
      if (interruptFn) interruptFn();
      setInterrupted(false);
    }
  }, [interrupted, interruptFn]);

  const interruptibleFn = () => {
    const timeout = setTimeout(() => {
      fn();
    }, delay);

    setInterruptFn(() => () => {
      clearTimeout(timeout);
    });
  };

  return {
    interruptibleFn,
    interrupt: () => {
      setInterrupted(true);
    },
  };
};
