import { useEffect, useState } from "react";
import { createUseClassNames, Icon } from "./theme";
//Cherry pick the custom components you wish to import.
import { Typography } from "../../Typography";
//Use this hook to know if the dark mode is currently enabled.
//and to toggle it's state.
import { useIsDarkModeEnabled } from "../../lib";
//Yo can import and use Materia-UI components, they will blend in nicely.
import Switch from "@material-ui/core/Switch";
import { useSplashScreen } from "../../splashScreen";

//See: https://github.com/garronej/tss-react
const { useClassNames } = createUseClassNames()(theme => ({
    "root": {
        "backgroundColor": theme.colors.useCases.surfaces.background,
        /*
        theme.colors.palette.shinyPink.main <- your custom color
        theme.colors.useCases.flashes.cute  <- your custom use case
        theme.muiTheme                      <- the theme object as defined by @material-ui/core
        */
    },
}));

export function MyComponent() {
    const { isDarkModeEnabled, setIsDarkModeEnabled } = useIsDarkModeEnabled();

    const { classNames } = useClassNames({});

    {
        const { hideSplashScreen } = useSplashScreen();

        useEffect(() => {
            //Call this when your component is in a state ready to be shown
            hideSplashScreen();
        }, []);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoading, setIsLoading] = useState(false);

    // This pattern let you display the splash screen when the isLoading state is true.
    {
        const { showSplashScreen, hideSplashScreen } = useSplashScreen();

        useEffect(() => {
            if (isLoading) {
                showSplashScreen({ "enableTransparency": true });
            } else {
                hideSplashScreen();
            }
        }, [isLoading]);
    }

    return (
        <div className={classNames.root}>
            <Typography>
                <Icon id="hello" />
                Hello World
            </Typography>
            <Switch
                checked={isDarkModeEnabled}
                onChange={() => setIsDarkModeEnabled(!isDarkModeEnabled)}
            />
        </div>
    );
}
