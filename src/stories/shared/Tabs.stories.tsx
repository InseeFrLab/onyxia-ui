

import { Tabs } from "app/components/shared/Tabs";
import type { Props } from "app/components/shared/Tabs";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "stories/geStory";
import { css } from "tss-react";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { "Tabs": Tabs as any }
});

export default meta;

const props: Props = {
    "size": "big",
    "className": css({ "width": 1278 }),
    "activeTabId": "info",
    /* spell-checker: disable */
    "tabs": [
        {
            "id": "info",
            "title": "Information du compte"
        }, {
            "id": "configs",
            "title": "Configuration des comptes"
        }, {
            "id": "storage",
            "title": "Connexion au stockage"
        }, {
            "id": "ui",
            "title": "Mode d'interface"
        }
    ],
    /* spell-checker: enable */
    "maxTabCount": 5,
    "children": <h1>Content</h1>,
    ...logCallbacks(["onRequestChangeActiveTab"])
}


export const VueBig = getStory(props);
export const VueSmall = getStory({
    ...props,
    "size": "small",
    "tabs": [
        {
            "id": "kub",
            "title": "Kubernetes"
        },
        {
            "id": "r",
            "title": "R"
        },
        {
            "id": "init",
            "title": "Init"
        },
        {
            "id": "security",
            "title": "Security"
        },
        {
            "id": "environnement",
            "title": "Environnement"
        },
        {
            "id": "git",
            "title": "Git"
        }
    ]
});
