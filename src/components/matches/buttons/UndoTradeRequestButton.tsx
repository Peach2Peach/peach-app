import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useToggleBoolean } from "../../../hooks/useToggleBoolean";
import { AppPopup } from "../../../popups/AppPopup";
import { WarningPopup } from "../../../popups/WarningPopup";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { useTradeRequest } from "../../../views/explore/useTradeRequest";
import { Button } from "../../buttons/Button";
import { useClosePopup, useSetPopup } from "../../popup/GlobalPopup";
import { PopupAction } from "../../popup/PopupAction";
import { ClosePopupAction } from "../../popup/actions/ClosePopupAction";
import { UndoButton } from "./UndoButton";

type Props = {
  offerId: string;
  requestingOfferId?: string;
  interrupTradeRequest: () => void;
  setShowMatchedCard: (show: boolean) => void;
};

export const UndoTradeRequestButton = ({
  offerId,
  requestingOfferId,
  interrupTradeRequest,
  setShowMatchedCard,
}: Props) => {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const { mutate: unmatch } = useUndoTradeRequest(offerId, requestingOfferId);
  const { data } = useTradeRequest(offerId, requestingOfferId);
  const [showUnmatch, toggle] = useToggleBoolean(!!data?.tradeRequest);

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
                unmatch(undefined, {
                  onSuccess: () => {
                    setShowMatchedCard(false);
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
  }, [closePopup, setPopup, setShowMatchedCard, unmatch]);

  const onUndoPress = () => {
    interrupTradeRequest();
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

function useUndoTradeRequest(offerId: string, requestingOfferId?: string) {
  //@ts-ignore
  console.log("This is offerId", offerId);
  //@ts-ignore
  console.log("This is requesting offerId", requestingOfferId);

  return useMutation({
    onMutate: async () => {
      //define onMutate
    },
    mutationFn: async () => {
      //define mutationFn
    },
    onError: (_error, _variables) => {
      //define on Error
    },
    onSettled: () => {
      //define onSettled
    },
  });
}
