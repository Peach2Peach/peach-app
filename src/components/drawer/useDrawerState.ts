import { ReactNode } from "react";
import { create } from "zustand";
import { DrawerOptionType } from "./components/DrawerOption";

export type DrawerState = {
  title: string;
  content?: ReactNode | null;
  options: DrawerOptionType[];
  show: boolean;
  previousDrawer?: DrawerState | undefined;
  onClose?: () => void;
};
export const defaultState: DrawerState = {
  title: "",
  content: null,
  options: [],
  show: false,
  previousDrawer: undefined,
  onClose: () => null,
};

type DrawerActions = {
  updateDrawer: (newState: Partial<DrawerState>) => void;
};

export const useDrawerState = create<DrawerState & DrawerActions>((set) => ({
  ...defaultState,
  updateDrawer: (newState) =>
    set({
      title: newState.title || defaultState.title,
      content: newState.content ?? defaultState.content,
      options: newState.options ?? defaultState.options,
      show: newState.show ?? defaultState.show,
      previousDrawer: newState.previousDrawer,
      onClose: newState.onClose || defaultState.onClose,
    }),
}));
