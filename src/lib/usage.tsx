import { createThemeProvider, defaultPalette, createDefaultColorUseCases } from "./index";
import "onyxia-design-lab/assets/fonts/work-sans.css";

const { OnyxiaThemeProvider, useOnyxiaTheme } = createThemeProvider({
    "palette": {
        ...defaultPalette,
        "shinyPink": {
            "main": "#3333",
        },
    },
    "createColorUseCases": ({ isDarkModeEnabled, palette }) => ({
        ...createDefaultColorUseCases({ isDarkModeEnabled, palette }),
        "flashes": {
            "cute": palette.shinyPink.main,
            "sad": palette.orangeWarning.light,
        },
    }),
});

function Root() {
    const onyxiaTheme = useOnyxiaTheme();

    return <OnyxiaThemeProvider></OnyxiaThemeProvider>;
}

function MyComponent() {
    return <></>;
}
