import tw from "../../styles/tailwind";

export const headerIcons = {
  bitcoin: { id: "bitcoin", color: tw.color("bitcoin") },
  expressFlowSorter: { id: "sortBy", color: tw.color("warning-main") }, // todo: change to Sort svg
  buyFilter: { id: "filter", color: tw.color("success-main") },
  cancel: { id: "xCircle", color: tw.color("black-50") },
  sixnine: { id: "bitcoin", color: tw.color("success-main") },
  checkbox: { id: "checkboxMark", color: tw.color("primary-main") },
  delete: { id: "trash", color: tw.color("error-main") },
  edit: { id: "edit3", color: tw.color("black-65") },
  generateBlock: { id: "cpu", color: tw.color("warning-main") },
  help: { id: "helpCircle", color: tw.color("info-light") },
  list: { id: "yourTrades", color: tw.color("black-65") },
  listFlipped: { id: "listFlipped", color: tw.color("primary-main") },
  percent: { id: "percent", color: tw.color("primary-main") },
  search: { id: "search", color: tw.color("primary-mild-2") },
  sellFilter: { id: "filter", color: tw.color("primary-main") },
  share: { id: "share", color: tw.color("black-50") },
  wallet: { id: "wallet", color: tw.color("black-65") },
  warning: { id: "alertOctagon", color: tw.color("error-main") },
  buyPreferences: { id: "edit", color: tw.color("success-main") },
  filter: { id: "filter", color: tw.color("primary-main") },
} as const;
