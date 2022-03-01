import { useEffect, useState } from "react";
import { makeStyles, Icon, Text, Button } from "./theme";
//Cherry pick the custom components you wish to import.
import { Alert } from "onyxia-ui/Alert";

//Use this hook to know if the dark mode is currently enabled.
//and to toggle it's state.
//Yo can import and use Materia-UI components, they will blend in nicely.
import Switch from "@mui/material/Switch";
import { useSplashScreen, useIsDarkModeEnabled } from "onyxia-ui";
import { useDomRect } from "powerhooks";

import { useElementEvt } from "evt/hooks/useElementEvt";

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



    const { top, refScrollable, refSticky } = (function useClosure() {

        const { ref: refSticky, domRect: { top: topSticky } } = useDomRect();
        const { ref: refScrollable, domRect: { top: topScrollable } } = useDomRect();

        const [top, setTop] = useState<number | undefined>(undefined);

        useEffect(
            () => {

                if (top !== undefined) {
                    return;
                }
                if (topSticky === 0 || topScrollable === 0 ) {
                    return;
                }

                setTop(topSticky - topScrollable);

            },
            [topSticky, topScrollable]
        );

        return { top , refSticky, refScrollable };


    })();


    useElementEvt(
        ({ element }) => {

            const topSticky = getOffset(element).top;
            const topScrollable = getOffset(refScrollable.current).top;


            //console.log(topSticky, topScrollable, topSticky - topScrollable);

        },
        refSticky,
        []
    );


    return (
        <div className={classes.root}>
            <div style={{ width: 100, height: 100, backgroundColor: "blue", position: "fixed", left: 600 }} />
            <div className={classes.sticky}>
                <Alert severity="success">Onyxia UI successfully setup!</Alert>
                <Text typo="my hero">
                    <Icon iconId="hello" />
                    Hello World
                </Text>
                <Text typo="display heading">Display heading with Marianne font</Text>
                <Text typo="body 1">Toggle dark mode</Text>
                <Switch
                    checked={isDarkModeEnabled}
                    onChange={() => setIsDarkModeEnabled(!isDarkModeEnabled)}
                />
                <Button
                    onClick={async () => {

                        setIsLoading(true);

                        await new Promise(resolve => setTimeout(resolve, 5000));

                        setIsLoading(false);

                    }}
                >Show splash screen a few seconds</Button>
            </div>
            {/*
            <div ref={refScrollable} style={{ "width": 400, "height": 300, "border": "1px solid white", "backgroundColor": "pink", "overflow": "auto", }}>
                <h1>Scrolls</h1>
                <h1 ref={refSticky} style={{ "position": "sticky", "top": top }}>Sticky</h1>
                {new Array(34).fill("").map((...[, i]) => <h3 key={i}>Line n°{i}</h3>)}
            </div>
            */}

            <div ref={refScrollable} style={{ "width": 400, "height": 300, "backgroundColor": "pink", "overflow": "auto", }}>
                <div style={{
                    "display": "flex",
                    "flexDirection": "column"
                }}>

                    <div style={{ "height": 50, "position": "sticky", "top": 0  }}>Header</div>
                    <div style={{  "flex": 1, "display": "flex", "position": "relative" }}>
                        <div
                            ref={refSticky}
                            style={{
                                "width": 70,
                                "backgroundColor": "cyan",
                                "height": 300 - 50,
                                "position": "sticky",
                                //"top": 50,
                                top
                            }}
                        >
                            Left bar ?
                        </div>
                        <div
                            style={{ "flex": 1, "backgroundColor": "lightGreen" }}
                        >
                            {new Array(34).fill("").map((...[, i]) => <h3 key={i}>Line n°{i}</h3>)}

                        </div>
                    </div>

                </div>

            </div>

            <div>
                {new Array(34).fill("").map((...[, i]) => <h3 key={i}>Line n°{i}</h3>)}
            </div>
        </div>
    );
}

//See: https://github.com/garronej/tss-react
const useStyles = makeStyles({ "name": { MyComponent } })(theme => ({
    "root": {
        "backgroundColor": theme.colors.useCases.surfaces.background,
        /*
        theme.colors.palette.shinyPink.main <- your custom color
        theme.colors.useCases.flashes.cute  <- your custom use case
        theme.muiTheme                      <- the theme object as defined by @mui/material
        */
    },
    "sticky": {
        "position": "sticky",
        "top": 0
    }
}));

function getOffset(el: any) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}