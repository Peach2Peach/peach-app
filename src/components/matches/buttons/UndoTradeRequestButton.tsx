import { useCallback } from "react";
import { useToggleBoolean } from "../../../hooks/useToggleBoolean";
import { AppPopup } from "../../../popups/AppPopup";
import tw from "../../../styles/tailwind";
import { useMutation } from "@tanstack/react-query";
import { WarningPopup } from "../../../popups/WarningPopup";
import i18n from "../../../utils/i18n";
import { Button } from "../../buttons/Button";
import { useClosePopup, useSetPopup } from "../../popup/GlobalPopup";
import { PopupAction } from "../../popup/PopupAction";
import { ClosePopupAction } from "../../popup/actions/ClosePopupAction";
import { UndoButton } from "./UndoButton";
import { GetOfferResponseBody } from "../../../../peach-api/src/public/offer/getOffer";
import { useTradeRequest } from "../../../views/explore/useTradeRequest";

type Props = {
  offer: GetOfferResponseBody;
  interrupTradeRequest: () => void;
  setShowMatchedCard: (show: boolean) => void;
};

export const UndoTradeRequestButton = ({
  offer,
  interrupTradeRequest,
  setShowMatchedCard,
}: Props) => {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const { mutate: unmatch } = useUndoTradeRequest(offer);
  const { data } = useTradeRequest(offer.id);
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

function useUndoTradeRequest(offer: GetOfferResponseBody) {
  console.log(offer);

  return useMutation({
    onMutate: async () => {
      //define onMutate
    },
    mutationFn: async () => {
      //define mutationFn
    },
    onError: (_error, _variables, context) => {
      //define on Error
    },
    onSettled: () => {
      //define onSettled
    },
  });
}
