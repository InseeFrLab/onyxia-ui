import { useEffect } from "react";
import { createUseClassNames, Icon } from "./theme";
//Cherry pick the custom components you wish to import.
import { Typography } from "../../Typography";
//Use this hook to know if the dark mode is currently enabled.
//and to toggle it's state.
import { useIsDarkModeEnabled } from "../../lib";
//Yo can import and use Materia-UI components, they will blend in nicely.
import Switch from "@material-ui/core/Switch";
import { hideSplashScreen } from "../../splashScreen";

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

    useEffect(() => {
        //Call this when your component is in a state ready to be shown
        hideSplashScreen();
    }, []);

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
