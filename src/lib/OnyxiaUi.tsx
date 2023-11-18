import "minimal-polyfills/Object.fromEntries";
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";
import { useState, useContext, type ReactNode } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import * as mui from "@mui/material/styles";
import { useWindowInnerSize } from "powerhooks/useWindowInnerSize";
import type { PaletteBase, ColorUseCasesBase } from "./color";
import { createSplashScreen, type SplashScreenParams } from "./SplashScreen";
import { assert } from "tsafe/assert";
import { Evt, type StatefulEvt } from "evt";
import { typeGuard } from "tsafe/typeGuard";
import { useRootFontSizePx } from "../tools/useRootFontSizePx";
import { memoize } from "../tools/memoize";
import { Reflect } from "tsafe/Reflect";
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
import { baseUrlContext } from "./baseUrl";

/**
 * BASE_URL:
 * If using Vite:
 * BASE_URL: import.meta.env.BASE_URL
 * If using CRA:
 * BASE_URL: process.env.PUBLIC_URL
 * If using something else:
 * Figure out what's the equivalent in your context.
 *
 * isGlobal:
 *
 * Default: true
 *
 * If true OnyxiaUi will apply transformation to the document automatically.
 * Set to false in storybook or in any context where you don't want OnyxiaUi
 * to have side effect beyond the scope of the children of the <OnyxiaUi /> component.
 */
export function createOnyxiaUi<
    Palette extends PaletteBase = PaletteBase,
    ColorUseCases extends ColorUseCasesBase = ColorUseCasesBase,
    CustomTypographyVariantName extends string = never,
>(
    params: ParamsOfCreateThemeFactory<
        Palette,
        ColorUseCases,
        CustomTypographyVariantName
    > & {
        /** Default true */
        isGlobal?: boolean;
        splashScreenParams?: SplashScreenParams;
        defaultIsDarkModeEnabled?: boolean;
        BASE_URL: string;
    },
): {
    OnyxiaUi: (props: {
        /** Just for debug or for MDX */
        dark?: boolean;
        children: ReactNode;
    }) => JSX.Element;
    evtIsDarkModeEnabled: StatefulEvt<boolean>;
    ofTypeTheme: Theme<Palette, ColorUseCases, CustomTypographyVariantName>;
} {
    const {
        isGlobal = true,
        splashScreenParams,
        defaultIsDarkModeEnabled = getIsDarkModeEnabledOsDefault(),
        BASE_URL,
        ...paramsOfCreateTheme
    } = params;

    const evtIsDarkModeEnabled = isGlobal
        ? createUseIsDarkModeEnabledGlobalState({ defaultIsDarkModeEnabled })
        : Evt.create(defaultIsDarkModeEnabled);

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
                    if (!isGlobal) {
                        break add_theme_meta_to_document;
                    }

                    const backgroundColor =
                        theme.colors.useCases.surfaces.background;

                    document.documentElement.style.backgroundColor =
                        backgroundColor;

                    // eslint-disable-next-line no-constant-condition
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
            { "max": 1 },
        );

        return { memoizedCreateTheme };
    })();

    const CssGlobalBaselineOrScopedBaseline: (props: {
        children: ReactNode;
    }) => JSX.Element = isGlobal
        ? ({ children }) => (
              <>
                  <CssBaseline />
                  {children}
              </>
          )
        : ({ children }) => <ScopedCssBaseline>{children}</ScopedCssBaseline>;
    function DarkModeProvider(props: {
        dark: boolean | undefined;
        children: ReactNode;
    }) {
        const { dark, children } = props;

        assert(evtIsDarkModeEnabled !== undefined);

        useState(() => {
            if (dark === undefined) {
                return;
            }

            evtIsDarkModeEnabled.state = dark;
        });

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
                    "isDarkModeEnabled": evtIsDarkModeEnabled.state,
                    setIsDarkModeEnabled,
                }}
            >
                {children}
            </isDarkModeEnabledContext.Provider>
        );
    }

    function ThemeProvider(props: { children: ReactNode }) {
        const { children } = props;

        const isDarkModeEnabledApi = useContext(isDarkModeEnabledContext);

        assert(isDarkModeEnabledApi !== undefined);

        const { windowInnerWidth } = useWindowInnerSize();

        const { rootFontSizePx } = useRootFontSizePx();

        const theme = memoizedCreateTheme(
            isDarkModeEnabledApi.isDarkModeEnabled,
            windowInnerWidth,
            rootFontSizePx,
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
                  isGlobal,
                  "Can't use splash screen on a scoped theme provider",
              ),
              createSplashScreen({
                  "assetUrl": splashScreenParams.assetUrl,
                  "fadeOutDuration": splashScreenParams.fadeOutDuration,
                  "minimumDisplayDuration":
                      splashScreenParams.minimumDisplayDuration,
                  "assetScaleFactor": splashScreenParams.assetScaleFactor,
              }).SplashScreen);

    function OnyxiaUi(props: { children: ReactNode; dark?: boolean }) {
        const { dark, children } = props;
        return (
            <CssGlobalBaselineOrScopedBaseline>
                <DarkModeProvider dark={dark}>
                    <ThemeProvider>
                        <MuiThemeProvider>
                            <baseUrlContext.Provider value={BASE_URL}>
                                <MaybeSplashScreen>
                                    {children}
                                </MaybeSplashScreen>
                            </baseUrlContext.Provider>
                        </MuiThemeProvider>
                    </ThemeProvider>
                </DarkModeProvider>
            </CssGlobalBaselineOrScopedBaseline>
        );
    }

    return {
        OnyxiaUi,
        evtIsDarkModeEnabled,
        ofTypeTheme: Reflect<ReturnType<typeof memoizedCreateTheme>>(),
    };
}
