
export type FormFieldValue = {
    path: string[];
    value: string | boolean | number;
};

export function formFieldsValueToObject(
    formFieldsValue: Pick<FormFieldValue, "path" | "value">[]
): Record<string, unknown> {
    return [...formFieldsValue]
        .sort(
            (a, b) => JSON.stringify(a.path)
                .localeCompare(JSON.stringify(b.path))
        )
        .reduce<Record<string, unknown>>((launchRequestOptions, formField) => {

            (function callee(
                props: {
                    launchRequestOptions: Record<string, unknown>;
                    formFieldValue: FormFieldValue;
                }
            ): void {

                const { launchRequestOptions, formFieldValue: formField } = props;

                const [key, ...rest] = formField.path

                if (rest.length === 0) {

                    launchRequestOptions[key] = formField.value;

                } else {

                    callee({
                        //"launchRequestOptions": launchRequestOptions[key] ??= {} as any,
                        "launchRequestOptions": launchRequestOptions[key] ?? (launchRequestOptions[key] = {} as any),
                        "formFieldValue": {
                            "path": rest,
                            "value": formField.value
                        }
                    })

                }

            })({
                launchRequestOptions,
                formFieldValue: formField
            });

            return launchRequestOptions

        }, {});
}