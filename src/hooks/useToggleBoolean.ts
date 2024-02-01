import { useCallback, useState } from "react";

export const useToggleBoolean = (
  initialValue = false,
): [boolean, () => void] => {
  const [value, setValue] = useState(initialValue);
  const toggleValue = useCallback(() => setValue((prev) => !prev), []);
  return [value, toggleValue];
};
