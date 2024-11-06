import { useEffect, useState } from "react";
import { tss } from "./tss";
import { Text, customIcons } from "./theme";
//Cherry pick the custom components you wish to import.
import { Alert } from "onyxia-ui/Alert";

//Use this hook to know if the dark mode is currently enabled.
//and to toggle it's state.
//Yo can import and use Materia-UI components, they will blend in nicely.
import Switch from "@mui/material/Switch";
import { useSplashScreen, useDarkMode } from "onyxia-ui";
import type { MuiIconComponentName } from "onyxia-ui/MuiIconComponentName";
import { id } from "tsafe/id";
import { Icon } from "onyxia-ui/Icon";
import { IconButton } from "onyxia-ui/IconButton";
import { Button } from "onyxia-ui/Button";
import { TextFormDialog, type TextFormDialogProps } from "./TextFormDialog";
import { useConst } from "powerhooks/useConst";
import { Evt } from "evt";
import { ThemedImage } from "onyxia-ui/ThemedImage";

export function MyComponent() {
    const { isDarkModeEnabled, setIsDarkModeEnabled } = useDarkMode();

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
                showSplashScreen({ enableTransparency: true });
            } else {
                hideSplashScreen();
            }
            // eslint-disable-next-line
        }, [isLoading]);
    }

    const evtTextFormDialogOpen = useConst(() =>
        Evt.create<TextFormDialogProps["evtOpen"]>(),
    );

    const { classes, css } = useStyles();

    return (
        <div className={classes.root}>
            <Alert severity="success">Onyxia UI successfully setup!</Alert>
            <Text typo="my hero">
                <Icon
                    icon={id<MuiIconComponentName>("EmojiPeople")}
                    className={css({
                        fontSize: "inherit",
                        ...(() => {
                            const factor = 0.92;
                            return {
                                width: `${factor}em`,
                                height: `${factor}em`,
                            };
                        })(),
                    })}
                />
                Hello World
            </Text>
            <Text typo="display heading">
                Display heading with Marianne font
            </Text>
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
            >
                Show splash screen a few seconds
            </Button>
            <br />
            <IconButton
                icon={customIcons.fooSvgUrl}
                href="http://example.com"
            />
            <Button
                onClick={() => {
                    evtTextFormDialogOpen.post({
                        defaultText: "Hello World",
                        resolveText: ({ doProceed, text }) => {
                            if (!doProceed) {
                                alert("You cancelled the dialog");
                                return;
                            }

                            alert(`You entered: ${text}`);
                        },
                    });
                }}
            >
                Open Dialog
            </Button>
            <TextFormDialog evtOpen={evtTextFormDialogOpen} />
            <ThemedImage
                url="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20fill='none'%20version='1.1'%20viewBox='0%200%2033.333%2026.458'%20%3e%3cpath%20d='M30.435%2026.458H2.899A2.892%202.892%200%20010%2023.572V2.886A2.892%202.892%200%20012.899%200h6.42c.968%200%201.873.482%202.411%201.285l.695%201.038a2.902%202.902%200%20002.411%201.285h15.599c1.6%200%202.898%201.292%202.898%202.886v17.078a2.892%202.892%200%2001-2.898%202.886z'%20%3e%3c/path%3e%3c/svg%3e"
                className={classes.themedImageData}
            />
        </div>
    );
}

//See: https://github.com/garronej/tss-react
const useStyles = tss.withName({ MyComponent }).create(({ theme }) => ({
    root: {
        backgroundColor: theme.colors.useCases.surfaces.background,
        /*
            theme.colors.palette.shinyPink.main <- your custom color
            theme.colors.useCases.flashes.cute  <- your custom use case
            theme.muiTheme                      <- the theme object as defined by @mui/material
            */
    },
    themedImageData: {
        filter: "drop-shadow(0px 4px 4px rgba(44, 50, 63, 0.2))",
        fill: "currentColor",
        color: theme.colors.useCases.typography.textFocus,
        display: "block",
        width: 60,
        marginTop: theme.spacing(2),
    },
}));
