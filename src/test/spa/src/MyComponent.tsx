import { useEffect, useState } from "react";
import { makeStyles, Icon, Text, Button } from "./theme";
//Cherry pick the custom components you wish to import.
import { Alert } from "onyxia-ui/Alert";

//Use this hook to know if the dark mode is currently enabled.
//and to toggle it's state.
//Yo can import and use Materia-UI components, they will blend in nicely.
import Switch from "@mui/material/Switch";
import { useSplashScreen, useIsDarkModeEnabled } from "onyxia-ui";

//See: https://github.com/garronej/tss-react
const useStyles= makeStyles()(theme => ({
    "root": {
        "backgroundColor": theme.colors.useCases.surfaces.background,
        /*
        theme.colors.palette.shinyPink.main <- your custom color
        theme.colors.useCases.flashes.cute  <- your custom use case
        theme.muiTheme                      <- the theme object as defined by @mui/material
        */
    },
}));

export function MyComponent() {

    const { isDarkModeEnabled, setIsDarkModeEnabled } = useIsDarkModeEnabled();


    {
        const { hideRootSplashScreen } = useSplashScreen();

        useEffect(() => {

            //Call this when your component is in a state ready to be shown
            hideRootSplashScreen();

        // eslint-disable-next-line
        }, []);
    }

    // This pattern let you display the splash screen when the isLoading state is true.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoading, setIsLoading] = useState(false);

    {
        const { showSplashScreen, hideSplashScreen } = useSplashScreen();

        useEffect(() => {
            if (isLoading) {
                showSplashScreen({ "enableTransparency": true });
            } else {
                hideSplashScreen();
            }
        // eslint-disable-next-line
        }, [isLoading]);
    }

    const { classes } = useStyles();

    return (
        <div className={classes.root}>
            <Alert severity="success">Onyxia UI successfully setup!</Alert>
            <Text typo="my hero">
                <Icon iconId="hello" />
                Hello World
            </Text>
            <Text typo="body 1">Toggle dark mode</Text>
            <Switch
                checked={isDarkModeEnabled}
                onChange={() => setIsDarkModeEnabled(!isDarkModeEnabled)}
            />
            <Button
                onClick={async ()=> {

                    setIsLoading(true);

                    await new Promise(resolve => setTimeout(resolve, 5000));

                    setIsLoading(false);

                }}
            >Show splash screen a few seconds</Button>
        </div>
    );
}
