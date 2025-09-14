import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export function createUseAsync<T extends Object>(getAsync: () => Promise<T>) {
    let pr: Promise<T> | undefined = undefined;
    let pr_value: T | undefined = undefined;

    return function useAsync() {
        const [value, setValue] = useState<T | undefined>(() => pr_value);

        useEffect(() => {
            let isActive = true;

            pr ??= getAsync().then(value => {
                pr_value = value;
                return value;
            });

            pr.then(value => {
                if (!isActive) {
                    return;
                }
                setValue(() => value);
            });

            return () => {
                isActive = false;
            };
        }, []);

        return value;
    };
}
