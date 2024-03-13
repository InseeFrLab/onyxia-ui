import { useState, memo } from "react";
import { Dialog } from "onyxia-ui/Dialog";
import { TextField } from "onyxia-ui/TextField";
import { Button } from "onyxia-ui/Button";
import type { NonPostableEvt, UnpackEvt } from "evt";
import { useEvt } from "evt/hooks";
import { assert } from "tsafe/assert";

export type TextFormDialogProps = {
    evtOpen: NonPostableEvt<{
        defaultText: string;
        resolveText: (
            params:
                | {
                      doProceed: false;
                      text?: never;
                  }
                | {
                      doProceed: true;
                      text: string;
                  },
        ) => void;
    }>;
};

type OpenParams = UnpackEvt<TextFormDialogProps["evtOpen"]>;

export const TextFormDialog = memo((props: TextFormDialogProps) => {
    const { evtOpen } = props;

    const [openState, setOpenState] = useState<
        | {
              text: string;
              resolveText: OpenParams["resolveText"];
          }
        | undefined
    >(undefined);

    useEvt(
        ctx => {
            evtOpen.attach(ctx, ({ defaultText, resolveText }) =>
                setOpenState({
                    "text": defaultText,
                    resolveText,
                }),
            );
        },
        [evtOpen],
    );

    const onCancel = () => {
        assert(openState !== undefined);

        openState.resolveText({ "doProceed": false });

        setOpenState(undefined);
    };

    return (
        <Dialog
            title="My dialog"
            subtitle="My subtitle"
            isOpen={openState !== undefined}
            onClose={onCancel}
            //fullWidth
            //maxWidth="lg"
            body={
                openState !== undefined && (
                    <>
                        <TextField
                            label="Sensitive text"
                            type="sensitive"
                            selectAllTextOnFocus
                            defaultValue={openState.text}
                            onValueBeingTypedChange={({ value }) => {
                                assert(openState !== undefined);
                                setOpenState({ ...openState, "text": value });
                            }}
                        />

                        {/*
                            new Array(10).fill(null).map((_, index) => (
                                <p key={index} >
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut
                                    aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate
                                    velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat
                                    non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum.
                                </p>
                            ))
                            */}
                    </>
                )
            }
            buttons={
                <>
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            assert(openState !== undefined);

                            openState.resolveText({
                                "doProceed": true,
                                "text": openState.text,
                            });

                            setOpenState(undefined);
                        }}
                    >
                        Ok
                    </Button>
                </>
            }
            //doNotShowNextTimeText="Do not show next time"
            //onDoShowNextTimeValueChange={()=> {}}
        />
    );
});
