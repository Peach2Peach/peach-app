import { useState } from "react";
import { PopupAction, PopupActionProps } from "../PopupAction";

export function LoadingPopupAction(props: PopupActionProps) {
  const [isLoading, setLoading] = useState(false);
  return (
    <PopupAction
      {...props}
      onPress={async () => {
        setLoading(true);
        await props.onPress?.();
        setLoading(false);
      }}
      loading={isLoading || props.loading}
    />
  );
}
