import { useCallback } from "react";
import { AppPopup } from "../../../hooks/AppPopup";
import { useToggleBoolean } from "../../../hooks/useToggleBoolean";
import tw from "../../../styles/tailwind";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { offerKeys } from "../../../hooks/query/useOfferDetail";
import { WarningPopup } from "../../../popups/WarningPopup";
import i18n from "../../../utils/i18n";
import { error } from "../../../utils/log/error";
import { peachAPI } from "../../../utils/peachAPI";
import { matchesKeys } from "../../../views/search/hooks/useOfferMatches";
import { Button } from "../../buttons/Button";
import { useClosePopup, useSetPopup } from "../../popup/Popup";
import { PopupAction } from "../../popup/PopupAction";
import { ClosePopupAction } from "../../popup/actions/ClosePopupAction";
import { useSetToast } from "../../toast/Toast";
import { UndoButton } from "./UndoButton";

type Props = {
  match: Pick<Match, "matched" | "offerId">;
  offer: BuyOffer;
  interruptMatching: () => void;
  setShowMatchedCard: (show: boolean) => void;
};

export const UnmatchButton = ({
  match,
  offer,
  interruptMatching,
  setShowMatchedCard,
}: Props) => {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const { mutate: unmatch } = useUnmatchOffer(offer, match.offerId);

  const [showUnmatch, toggle] = useToggleBoolean(match.matched);

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
    interruptMatching();
    setPopup(<AppPopup id="matchUndone" />);
  };

  return showUnmatch ? (
    <Button
      onPress={showUnmatchPopup}
      iconId="minusCircle"
      textColor={tw`text-error-main`}
      style={tw`bg-primary-background-light`}
    >
      {i18n("search.unmatch")}
    </Button>
  ) : (
    <UndoButton onPress={onUndoPress} onTimerFinished={toggle} />
  );
};

function useUnmatchOffer(offer: BuyOffer, matchingOfferId: string) {
  const queryClient = useQueryClient();
  const setToast = useSetToast();

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: matchesKeys.matchesForOffer(offer.id),
      });
      await queryClient.cancelQueries({
        queryKey: matchesKeys.matchDetail(offer.id, matchingOfferId),
      });
      const previousData = queryClient.getQueryData<Match>([
        "matchDetails",
        offer.id,
        matchingOfferId,
      ]);
      queryClient.setQueryData<Match>(
        matchesKeys.matchDetail(offer.id, matchingOfferId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            matched: false,
          };
        },
      );
      return { previousData };
    },
    mutationFn: async () => {
      const { result, error: err } = await peachAPI.private.offer.unmatchOffer({
        offerId: offer.id,
        matchingOfferId,
      });
      if (result) {
        return result;
      }
      error("Error", err);
      setToast({ msgKey: err?.error || "error.general", color: "red" });
      throw new Error();
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        matchesKeys.matchDetail(offer.id, matchingOfferId),
        context?.previousData,
      );
    },
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: offerKeys.detail(offer.id) }),
        queryClient.invalidateQueries({ queryKey: offerKeys.summaries() }),
        queryClient.invalidateQueries({
          queryKey: matchesKeys.matchesForOffer(offer.id),
        }),
        queryClient.invalidateQueries({
          queryKey: matchesKeys.matchDetail(offer.id, matchingOfferId),
        }),
      ]),
  });
}
