import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { shallow } from "zustand/shallow";
import { Header } from "../../components/Header";
import { Flag } from "../../components/Flag";
import { Flags, type FlagType } from "../../components/flags";
import { Icon } from "../../components/Icon";
import { Loading } from "../../components/Loading";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { Checkbox } from "../../components/inputs/Checkbox";
import { Toggle } from "../../components/inputs/Toggle";
import { useDrawerState } from "../../components/drawer/useDrawerState";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { PeachText } from "../../components/text/PeachText";
import { LoadingPopup } from "../../popups/LoadingPopup";
import { SuccessPopup } from "../../popups/SuccessPopup";
import { WarningPopup } from "../../popups/WarningPopup";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { parseError } from "../../utils/parseError";
import { useNodeConfigState } from "../../utils/wallet/nodeConfigStore";
import { ensureNymProxy } from "../../utils/wallet/nym/ensureNymProxy";
import { getAllowedExitCountries } from "../../utils/wallet/nym/exitCountries";
import { isMixnetAllowedNode } from "../../utils/wallet/nym/isMixnetAllowedNode";
import { COUNTRY_NAMES } from "../../utils/wallet/nym/countryNames";
import { useNymProxyState } from "../../utils/wallet/nymProxyStore";
import { peachWallet } from "../../utils/wallet/setWallet";

/** Full country name for a 2-letter code — the app's own (localized) translation
 *  where it has one, else the bundled English name, else the raw code. Name
 *  only. (Hermes has no Intl.DisplayNames, so names are bundled statically.) */
const countryLabel = (code: string) => {
  const translated = i18n(`country.${code}`);
  if (translated !== `country.${code}`) return translated;
  return COUNTRY_NAMES[code] ?? code;
};

/** The app ships SVG flags for a subset of countries; exit countries outside
 *  that set (~1/3 of them) get a neutral globe placeholder so every row has one
 *  aligned image. */
function CountryFlag({ code }: { code: string }) {
  if (Flags[code as FlagType]) {
    // Rounded + clipped so the plain-rectangle flags match the app's rounded ones.
    return (
      <View style={tw`w-8 h-6 overflow-hidden rounded`}>
        <Flag id={code as FlagType} style={tw`w-8 h-6`} />
      </View>
    );
  }
  return (
    <View style={tw`items-center justify-center w-8 h-6`}>
      <Icon id="globe" size={16} color={tw.color("black-50")} />
    </View>
  );
}

// Plain JSON "what's my IP" endpoint. When the mixnet is on, this fetch is routed
// through it by the global native proxy, so the reported IP/country is the exit
// node's — a live way to verify which country traffic is exiting from.
const IP_CHECK_URL = "https://ipwho.is/";
const IP_CHECK_TIMEOUT = 20000;

export const MixnetSettings = () => {
  const setPopup = useSetPopup();
  const updateDrawer = useDrawerState((state) => state.updateDrawer);
  const node = useNodeConfigState((state) => state, shallow);
  // Mixnet only works with an Esplora node (others use ports public exits block).
  const mixnetAllowed = isMixnetAllowedNode(node);

  const [nymEnabled, nymCountries, setNymConfig] = useNymProxyState(
    (state) => [state.enabled, state.countries, state.setConfig],
    shallow,
  );
  const [localEnabled, setLocalEnabled] = useState(nymEnabled);

  // Allowed exit countries (Nym-supported minus BLOCKED_COUNTRIES), fetched on
  // open. Selection defaults to all; a stored empty list means "all allowed".
  const [available, setAvailable] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [countriesError, setCountriesError] = useState<string | undefined>();

  useEffect(() => {
    if (!mixnetAllowed) return undefined;
    let cancelled = false;
    setLoading(true);
    getAllowedExitCountries()
      .then((all) => {
        if (cancelled) return;
        setAvailable(all);
        setSelected(nymCountries.length ? nymCountries : all);
        setCountriesError(undefined);
      })
      .catch((e) => !cancelled && setCountriesError(parseError(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mixnetAllowed]);

  const allSelected =
    available.length > 0 && selected.length === available.length;

  const openCountryDrawer = () =>
    updateDrawer({
      title: i18n("wallet.settings.node.nym.countries.title"),
      show: true,
      content: (
        <CountrySelectDrawer
          available={available}
          initial={selected}
          onChange={setSelected}
        />
      ),
    });

  const applyNymConfig = async () => {
    if (!peachWallet) throw Error("Peach wallet not defined");
    // Store [] when every allowed country is selected — that means "all allowed"
    // and keeps tracking Nym adding new (non-blocked) countries. A strict subset
    // is stored explicitly.
    const countries = allSelected ? [] : selected;
    setNymConfig({ enabled: localEnabled, countries, serviceProvider: "" });
    setPopup(<LoadingPopup title={i18n("wallet.settings.node.nym.applied.title")} />);
    try {
      // silent: this flow shows its own Loading/Success/Warning popup below, so
      // it opts out of the background connecting/failure toasts.
      await ensureNymProxy({ silent: true });
      await peachWallet.initWallet();
      setPopup(
        <SuccessPopup
          title={i18n("wallet.settings.node.nym.applied.title")}
          content={i18n(
            localEnabled
              ? "wallet.settings.node.nym.applied.countries"
              : "wallet.settings.node.nym.applied.disabled",
          )}
          actions={
            <ClosePopupAction
              style={tw`justify-center`}
              textStyle={tw`text-black-100`}
            />
          }
        />,
      );
    } catch (e) {
      setPopup(
        <WarningPopup
          title={i18n("wallet.settings.node.nym.error.title")}
          content={<PeachText selectable>{parseError(e)}</PeachText>}
          actions={
            <ClosePopupAction
              style={tw`justify-center`}
              textStyle={tw`text-black-100`}
            />
          }
        />,
      );
    }
  };

  const testCurrentCountry = async () => {
    setPopup(
      <LoadingPopup
        title={i18n("wallet.settings.node.nym.testCountry.loading")}
      />,
    );
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), IP_CHECK_TIMEOUT);
    try {
      let data: { ip?: string; country?: string; country_code?: string };
      try {
        const res = await fetch(IP_CHECK_URL, { signal: controller.signal });
        data = await res.json();
      } finally {
        clearTimeout(timeout);
      }
      if (!data?.ip) throw new Error("EMPTY_RESPONSE");
      const country = data.country
        ? `${data.country}${data.country_code ? ` (${data.country_code})` : ""}`
        : data.country_code || "?";
      setPopup(
        <SuccessPopup
          title={i18n("wallet.settings.node.nym.testCountry.title")}
          content={i18n(
            "wallet.settings.node.nym.testCountry.result",
            data.ip,
            country,
          )}
          actions={
            <ClosePopupAction
              style={tw`justify-center`}
              textStyle={tw`text-black-100`}
            />
          }
        />,
      );
    } catch {
      setPopup(
        <WarningPopup
          title={i18n("wallet.settings.node.nym.testCountry.title")}
          content={
            <PeachText selectable>
              {i18n("wallet.settings.node.nym.testCountry.error")}
            </PeachText>
          }
          actions={
            <ClosePopupAction
              style={tw`justify-center`}
              textStyle={tw`text-black-100`}
            />
          }
        />,
      );
    }
  };

  const applyDisabled =
    localEnabled && !loading && !countriesError && selected.length === 0;

  return (
    <Screen header={<MixnetHeader />}>
      <PeachScrollView contentStyle={tw`gap-4 grow`} contentContainerStyle={tw`grow`}>
        <View style={tw`gap-3`}>
          <Toggle
            style={tw`justify-between px-2`}
            enabled={localEnabled && mixnetAllowed}
            disabled={!mixnetAllowed}
            onPress={() => setLocalEnabled((prev) => !prev)}
          >
            {i18n("wallet.settings.node.nym.title")}
          </Toggle>

          {!mixnetAllowed ? (
            <PeachText style={tw`px-2 text-black-65 body-s`}>
              {i18n("wallet.settings.node.nym.esploraOnly")}
            </PeachText>
          ) : (
            <>
              <PeachText style={tw`px-2 text-black-65 body-s`}>
                {i18n("wallet.settings.node.nym.countries")}
              </PeachText>
              {countriesError ? (
                <PeachText style={tw`px-2 text-error-main`}>
                  {countriesError}
                </PeachText>
              ) : (
                // While the country list loads the row stays visible but reads as
                // disabled (dimmed, not tappable) with a spinner where the count is.
                <TouchableOpacity
                  onPress={openCountryDrawer}
                  disabled={loading}
                  style={[
                    tw`flex-row items-center justify-between px-2 py-2`,
                    loading && tw`opacity-50`,
                  ]}
                >
                  <PeachText style={tw`settings text-black-65`}>
                    {i18n("wallet.settings.node.nym.countries.title")}
                  </PeachText>
                  <View style={tw`flex-row items-center gap-1`}>
                    {loading ? (
                      <Loading size="small" color={tw.color("black-50")} />
                    ) : (
                      <PeachText style={tw`body-s text-black-50`}>
                        {i18n(
                          "wallet.settings.node.nym.countries.all",
                          `${selected.length}`,
                          `${available.length}`,
                        )}
                      </PeachText>
                    )}
                    <Icon
                      id="chevronRight"
                      size={20}
                      color={tw.color(loading ? "black-50" : "primary-main")}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <View style={tw`self-stretch gap-3 mt-auto`}>
          <Button
            ghost
            textColor={tw.color("primary-main")}
            style={tw`self-center`}
            iconId="globe"
            onPress={testCurrentCountry}
          >
            {i18n("wallet.settings.node.nym.testCountry")}
          </Button>
          <Button
            disabled={applyDisabled}
            style={tw`self-center`}
            iconId="save"
            onPress={applyNymConfig}
          >
            {i18n("wallet.settings.node.nym.apply")}
          </Button>
        </View>
      </PeachScrollView>
    </Screen>
  );
};

function MixnetHeader() {
  return <Header title={i18n("settings.mixnet")} />;
}

type CountrySelectDrawerProps = {
  available: string[];
  initial: string[];
  onChange: (selected: string[]) => void;
};

/** Multi-select country checklist rendered inside the global drawer. Keeps at
 *  least one country selected and mirrors changes back to the screen. */
function CountrySelectDrawer({
  available,
  initial,
  onChange,
}: CountrySelectDrawerProps) {
  const { isDarkMode } = useThemeStore();
  const [selected, setSelected] = useState(initial);
  const update = (next: string[]) => {
    setSelected(next);
    onChange(next);
  };
  const toggle = (code: string) => {
    if (selected.includes(code)) {
      // Enforce at least one selected country.
      if (selected.length === 1) return;
      update(selected.filter((c) => c !== code));
    } else {
      update([...selected, code]);
    }
  };
  const allSelected = selected.length === available.length;

  return (
    <PeachScrollView contentStyle={tw`gap-3 px-6 pb-6`}>
      {/* Select-all header row: same indentation as a country row, no flag. */}
      <TouchableOpacity
        onPress={() => !allSelected && update(available)}
        style={tw`flex-row items-center gap-3 py-1`}
      >
        <View pointerEvents="none">
          <Checkbox checked={allSelected} onPress={() => undefined} />
        </View>
        <PeachText
          style={tw`subtitle-1 shrink ${isDarkMode ? "text-black-25" : ""}`}
        >
          {i18n(
            "wallet.settings.node.nym.countries.all",
            `${selected.length}`,
            `${available.length}`,
          )}
        </PeachText>
      </TouchableOpacity>
      {available.map((code) => (
        // Own row (not Checkbox children) so the flag sits beside the label
        // rather than inside its <Text>, with real spacing between each part.
        // The Checkbox is non-interactive; the whole row is the touch target.
        <TouchableOpacity
          key={code}
          onPress={() => toggle(code)}
          style={tw`flex-row items-center gap-3 py-1`}
        >
          <View pointerEvents="none">
            <Checkbox
              checked={selected.includes(code)}
              onPress={() => undefined}
            />
          </View>
          <CountryFlag code={code} />
          <PeachText
            style={tw`subtitle-1 shrink ${isDarkMode ? "text-black-25" : ""}`}
          >
            {countryLabel(code)}
          </PeachText>
        </TouchableOpacity>
      ))}
    </PeachScrollView>
  );
}
