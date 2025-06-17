import { useCallback } from "react";
import { useToggleBoolean } from "../../../hooks/useToggleBoolean";
import { AppPopup } from "../../../popups/AppPopup";
import tw from "../../../styles/tailwind";

import { UseMutateFunction } from "@tanstack/react-query";
import { WarningPopup } from "../../../popups/WarningPopup";
import i18n from "../../../utils/i18n";
import { Button } from "../../buttons/Button";
import { useClosePopup, useSetPopup } from "../../popup/GlobalPopup";
import { PopupAction } from "../../popup/PopupAction";
import { ClosePopupAction } from "../../popup/actions/ClosePopupAction";
import { UndoButton } from "./UndoButton";

type Props = {
  tradeRequested: boolean;
  interruptTradeRequest: () => void;
  setShowTradeRequested: (show: boolean) => void;
  undoTradeRequest: UseMutateFunction;
};

export const UnmatchButton = ({
  tradeRequested,
  interruptTradeRequest,
  setShowTradeRequested,
  undoTradeRequest,
}: Props) => {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();

  const [showUnmatch, toggle] = useToggleBoolean(tradeRequested);

  const showUnmatchPopup = useCallback(() => {
    setPopup(
      <WarningPopup
        title={i18n("search.popups.unmatch.title")}
        content={i18n("search.popups.unmatch.text")}
        actions={
          <>
            <PopupAction
              label={i18n("search.popups.unmatch.confirm")}
              iconId="minusCircle"
              textStyle={tw`text-black-100`}
              onPress={() => {
                setPopup(
                  <WarningPopup
                    title={i18n("search.popups.unmatched")}
                    actions={
                      <ClosePopupAction
                        style={tw`justify-center`}
                        textStyle={tw`text-black-100`}
                      />
                    }
                  />,
                );
                undoTradeRequest(undefined, {
                  onSuccess: () => {
                    setShowTradeRequested(false);
                  },
                });
              }}
            />
            <PopupAction
              label={i18n("search.popups.unmatch.neverMind")}
              textStyle={tw`text-black-100`}
              iconId="xSquare"
              onPress={closePopup}
              reverseOrder
            />
          </>
        }
      />,
    );
  }, [closePopup, setPopup, setShowTradeRequested, undoTradeRequest]);

  const onUndoPress = () => {
    interruptTradeRequest();
    setPopup(<AppPopup id="matchUndone" />);
  };

  return showUnmatch ? (
    <Button
      onPress={showUnmatchPopup}
      iconId="minusCircle"
      textColor={tw.color("error-main")}
      style={tw`bg-primary-background-light`}
    >
      {i18n("search.unmatch")}
    </Button>
  ) : (
    <UndoButton onPress={onUndoPress} onTimerFinished={toggle} />
  );
};
