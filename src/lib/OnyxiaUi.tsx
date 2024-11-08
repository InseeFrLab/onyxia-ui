import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";
import CssBaseline from "@mui/material/CssBaseline";
import "minimal-polyfills/Object.fromEntries";
import { useState, useContext, useEffect, type ReactNode } from "react";
import * as mui from "@mui/material/styles";
import type { PaletteBase, ColorUseCasesBase } from "./color";
import { createSplashScreen, type SplashScreenParams } from "./SplashScreen";
import { assert } from "tsafe/assert";
import type { StatefulReadonlyEvt } from "evt";
import { typeGuard } from "tsafe/typeGuard";
import { memoize } from "../tools/memoize";
import {
    themeContext,
    createThemeFactory,
    type ParamsOfCreateThemeFactory,
    Theme,
} from "./theme";
import {
    createUseIsDarkModeEnabledGlobalState,
    isDarkModeEnabledContext,
} from "./darkMode";
import { useRerenderOnStateChange } from "evt/hooks/useRerenderOnStateChange";
import { useConstCallback } from "powerhooks/useConstCallback";
import { getIsDarkModeEnabledOsDefault } from "../tools/getIsDarkModeEnabledOsDefault";
import { getEvtRootFontSizePx } from "../tools/evtRootFontSizePx";
import { getEvtWindowInnerSize } from "../tools/evtWindowInnerSize";
import { Evt } from "evt";

/**
 * BASE_URL:
 * If using Vite:
 * BASE_URL: import.meta.env.BASE_URL
 * If using CRA:
 * BASE_URL: process.env.PUBLIC_URL
 * If using something else:
 * Figure out what's the equivalent in your context.
 *
 * isScoped:
 *
 * Default: false
 *
 * If false OnyxiaUi will apply transformation to the document automatically.
 * Set to true in storybook or in any context where you don't want OnyxiaUi
 * to have side effect beyond the scope of the children of the <OnyxiaUi /> component.
 */
export function createOnyxiaUi<
    Palette extends PaletteBase = PaletteBase,
    ColorUseCases extends ColorUseCasesBase = ColorUseCasesBase,
    CustomTypographyVariantName extends string = never,
    IsScoped extends boolean = false,
>(
    params: ParamsOfCreateThemeFactory<
        Palette,
        ColorUseCases,
        CustomTypographyVariantName
    > & {
        isScoped?: IsScoped;
        splashScreenParams?: SplashScreenParams;
        defaultIsDarkModeEnabled?: boolean;
        getIconUrl?: (iconName: string) => string;
    },
): {
    OnyxiaUi: (props: {
        /** To dynamically force the mode */
        darkMode?: boolean;
        children: ReactNode;
    }) => JSX.Element;
    ofTypeTheme: Theme<Palette, ColorUseCases, CustomTypographyVariantName>;
} & (IsScoped extends true
    ? {}
    : {
          evtTheme: StatefulReadonlyEvt<
              Theme<Palette, ColorUseCases, CustomTypographyVariantName> & {
                  setIsDarkModeEnabled: (isDarkModeEnabled: boolean) => void;
              }
          >;
      }) {
    const {
        isScoped = false,
        splashScreenParams,
        defaultIsDarkModeEnabled = getIsDarkModeEnabledOsDefault(),
        getIconUrl = () => {
            throw new Error(
                "No dynamic icon resolver have been configured. Checkout @onyxia-ui/icons",
            );
        },
        ...paramsOfCreateTheme
    } = params;

    const { memoizedCreateTheme } = (() => {
        const { createTheme } = createThemeFactory(paramsOfCreateTheme);

        const memoizedCreateTheme = memoize(
            (
                isDarkModeEnabled: boolean,
                windowInnerWidth: number,
                rootFontSizePx: number,
            ) => {
                const theme = createTheme({
                    isDarkModeEnabled,
                    windowInnerWidth,
                    rootFontSizePx,
                });

                add_theme_meta_to_document: {
                    if (isScoped) {
                        break add_theme_meta_to_document;
                    }

                    const backgroundColor =
                        theme.colors.useCases.surfaces.background;

                    document.documentElement.style.backgroundColor =
                        backgroundColor;

                    while (true) {
                        const element = document.querySelector(
                            "meta[name=theme-color]",
                        );

                        if (element === null) {
                            break;
                        }

                        element.remove();
                    }

                    document.head.insertAdjacentHTML(
                        "beforeend",
                        `<meta name="theme-color" content="${backgroundColor}">`,
                    );
                }

                return theme;
            },
            { max: 1 },
        );

        return { memoizedCreateTheme };
    })();

    const CssGlobalBaselineOrScopedBaseline: (props: {
        children: ReactNode;
    }) => JSX.Element = !isScoped
        ? ({ children }) => (
              <>
                  <CssBaseline />
                  {children}
              </>
          )
        : ({ children }) => <ScopedCssBaseline>{children}</ScopedCssBaseline>;

    const evtIsDarkModeEnabled = isScoped
        ? undefined
        : createUseIsDarkModeEnabledGlobalState({ defaultIsDarkModeEnabled });

    const DarkModeProvider: (props: {
        darkMode: boolean | undefined;
        children: ReactNode;
    }) => JSX.Element = isScoped
        ? ({ darkMode, children }) => {
              const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(
                  darkMode ?? defaultIsDarkModeEnabled,
              );

              useEffect(() => {
                  if (darkMode === undefined) {
                      return;
                  }

                  setIsDarkModeEnabled(darkMode);
              }, [darkMode]);

              return (
                  <isDarkModeEnabledContext.Provider
                      value={{
                          isDarkModeEnabled,
                          setIsDarkModeEnabled,
                      }}
                  >
                      {children}
                  </isDarkModeEnabledContext.Provider>
              );
          }
        : ({ darkMode, children }) => {
              assert(evtIsDarkModeEnabled !== undefined);

              useState(() => {
                  if (darkMode === undefined) {
                      return;
                  }

                  evtIsDarkModeEnabled.state = darkMode;
              });

              useEffect(() => {
                  if (darkMode === undefined) {
                      return;
                  }

                  evtIsDarkModeEnabled.state = darkMode;
              }, [darkMode]);

              useRerenderOnStateChange(evtIsDarkModeEnabled);

              const setIsDarkModeEnabled = useConstCallback<
                  React.Dispatch<React.SetStateAction<boolean>>
              >(
                  setStateAction =>
                      (evtIsDarkModeEnabled.state = typeGuard<
                          (prevState: boolean) => boolean
                      >(setStateAction, typeof setStateAction === "function")
                          ? setStateAction(evtIsDarkModeEnabled.state)
                          : setStateAction),
              );

              return (
                  <isDarkModeEnabledContext.Provider
                      value={{
                          isDarkModeEnabled: evtIsDarkModeEnabled.state,
                          setIsDarkModeEnabled,
                      }}
                  >
                      {children}
                  </isDarkModeEnabledContext.Provider>
              );
          };

    function ThemeProvider(props: { children: ReactNode }) {
        const { children } = props;

        const isDarkModeEnabledContextValue = useContext(
            isDarkModeEnabledContext,
        );

        assert(isDarkModeEnabledContextValue !== undefined);

        useRerenderOnStateChange(evtWindowInnerSize);
        useRerenderOnStateChange(evtRootFontSizePx);

        const theme = memoizedCreateTheme(
            isDarkModeEnabledContextValue.isDarkModeEnabled,
            evtWindowInnerSize.state.windowInnerWidth,
            evtRootFontSizePx.state,
        );

        return (
            <themeContext.Provider value={theme}>
                {children}
            </themeContext.Provider>
        );
    }

    function MuiThemeProvider(props: { children: ReactNode }) {
        const { children } = props;

        const theme = useContext(themeContext);

        assert(theme !== undefined);

        return (
            <mui.ThemeProvider theme={theme.muiTheme}>
                {children}
            </mui.ThemeProvider>
        );
    }

    const MaybeSplashScreen: (props: { children: ReactNode }) => JSX.Element =
        splashScreenParams === undefined
            ? ({ children }) => <>{children}</>
            : (assert(
                  !isScoped,
                  "Can't use splash screen on a scoped theme provider",
              ),
              createSplashScreen({
                  assetUrl: splashScreenParams.assetUrl,
                  fadeOutDuration: splashScreenParams.fadeOutDuration,
                  minimumDisplayDuration:
                      splashScreenParams.minimumDisplayDuration,
                  assetScaleFactor: splashScreenParams.assetScaleFactor,
              }).SplashScreen);

    function OnyxiaUi(props: { children: ReactNode; darkMode?: boolean }) {
        const { darkMode, children } = props;
        return (
            <DarkModeProvider darkMode={darkMode}>
                <ThemeProvider>
                    <MuiThemeProvider>
                        <CssGlobalBaselineOrScopedBaseline>
                            <MaybeSplashScreen>{children}</MaybeSplashScreen>
                        </CssGlobalBaselineOrScopedBaseline>
                    </MuiThemeProvider>
                </ThemeProvider>
            </DarkModeProvider>
        );
    }

    const { evtRootFontSizePx } = getEvtRootFontSizePx();
    const { evtWindowInnerSize } = getEvtWindowInnerSize();

    const evtTheme = isScoped
        ? undefined
        : Evt.merge([
              (assert(evtIsDarkModeEnabled !== undefined),
              evtIsDarkModeEnabled),
              evtRootFontSizePx,
              evtWindowInnerSize,
          ])
              .toStateful()
              .pipe(() => [
                  {
                      ...memoizedCreateTheme(
                          evtIsDarkModeEnabled.state,
                          evtWindowInnerSize.state.windowInnerWidth,
                          evtRootFontSizePx.state,
                      ),
                      setIsDarkModeEnabled: (isDarkModeEnabled: boolean) => {
                          evtIsDarkModeEnabled.state = isDarkModeEnabled;
                      },
                  },
              ]);

    return {
        OnyxiaUi,
        ofTypeTheme: null as any,
        evtTheme: evtTheme as any,
    };
}
