import { onyxiaUiEarlyInit } from "onyxia-ui/earlyInit";

onyxiaUiEarlyInit({
    getPaletteOverride: undefined,
    isDarkModeEnabled_force: undefined,
});

import("./index.lazy");
