import { API_URL } from "@env";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";

export const getPublicHeaders = (): RequestInit["headers"] => ({
  Origin: API_URL,
  Referer: API_URL,
  Accept: "application/json",
  "Content-Type": "application/json",
  "User-Agent":
    useSettingsStore.getState().cloudflareChallenge?.userAgent || "",
});
