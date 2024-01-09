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
            body={
                openState !== undefined && (
                    <>
                        <TextField
                            label="My text"
                            defaultValue={openState.text}
                            onValueBeingTypedChange={({ value }) => {
                                assert(openState !== undefined);
                                setOpenState({ ...openState, "text": value });
                            }}
                        />
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
        />
    );
});
