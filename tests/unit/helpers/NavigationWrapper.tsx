import {
  NavigationContext,
  NavigationRouteContext,
  NavigationState,
} from "@react-navigation/native";

export const navigateMock = jest.fn();
export const replaceMock = jest.fn();
export const resetMock = jest.fn();
export const pushMock = jest.fn();
export const setParamsMock = jest.fn();
export const goBackMock = jest.fn();
export const canGoBackMock = jest.fn();
const isFocusedMock = jest.fn().mockReturnValue(true);
const unsubscribeMock = jest.fn();
const addListenerMock = jest.fn(() => unsubscribeMock);
const setOptionsMock = jest.fn();
export const getStateMock = jest.fn(
  (): NavigationState<RootStackParamList> => ({
    routes: [
      { key: "homeScreen", name: "homeScreen" },
      { key: "meetupScreen", name: "meetupScreen" },
    ],
    index: 1,
    key: "key",
    routeNames: ["homeScreen"],
    type: "stack",
    stale: false,
  }),
);
const dispatchMock = jest.fn();
const getIdMock = jest.fn();
const getParentMock = jest.fn();
const removeListenerMock = jest.fn();
const preloadMock = jest.fn();
const setStateForNextRouteNamesChangeMock = jest.fn();

export const navigationMock = {
  navigate: navigateMock,
  reset: resetMock,
  setOptions: setOptionsMock,
  replace: replaceMock,
  push: pushMock,
  setParams: setParamsMock,
  goBack: goBackMock,
  canGoBack: canGoBackMock,
  isFocused: isFocusedMock,
  addListener: addListenerMock,
  getState: getStateMock,
  dispatch: dispatchMock,
  getId: getIdMock,
  getParent: getParentMock,
  removeListener: removeListenerMock,
  navigateDeprecated: navigateMock,
  preload: preloadMock,
  setStateForNextRouteNamesChange: setStateForNextRouteNamesChangeMock,
};

type RouteMock<T extends keyof RootStackParamList = "homeScreen"> = {
  key: string;
  name: T;
  path?: string;
} & (undefined extends RootStackParamList[T]
  ? { params?: RootStackParamList[T] }
  : { params: RootStackParamList[T] });

export let routeMock: RouteMock<keyof RootStackParamList> = {
  key: "homeScreen",
  name: "homeScreen",
  params: { screen: "home" },
};
export const setRouteMock = <T extends keyof RootStackParamList = "homeScreen">(
  route: RouteMock<T>,
) => {
  routeMock = route;
};

export const NavigationWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <NavigationContext.Provider value={navigationMock}>
    <NavigationRouteContext.Provider value={routeMock}>
      {children}
    </NavigationRouteContext.Provider>
  </NavigationContext.Provider>
);

export const meetupScreenRoute: RouteMock<"meetupScreen"> = {
  key: "meetupScreen",
  name: "meetupScreen",
  params: {
    eventId: "pt.porto.portugal-norte-bitcoin",
    origin: "matchDetails",
  },
};
