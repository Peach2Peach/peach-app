import { useMemo, useState } from "react";
import { getErrorsInField } from "../utils/validation/getErrorsInField";
import { Rule } from "../utils/validation/rules";

export const useValidatedState = <S extends string | undefined>(
  input: S,
  rulesToCheck: Partial<Record<Rule, string | number | boolean | undefined>>,
) => {
  const [value, setValue] = useState(input);

  const errorMessage = useMemo(
    () => getErrorsInField(value || "", rulesToCheck),
    [value, rulesToCheck],
  );
  const isValid = useMemo(() => errorMessage.length === 0, [errorMessage]);

  return [value, setValue, isValid, errorMessage] as const;
};
