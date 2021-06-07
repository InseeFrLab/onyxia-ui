import { Dialog } from "../Dialog";
import { Button } from "./theme";
import type { DialogProps } from "../Dialog";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./geStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Dialog },
});

export default meta;

const props: DialogProps = {
    /* spell-checker: disable */
    "title": "Utiliser dans un service",
    "subtitle": "Le chemin du secret a été copié. ",
    "body": `
    Au moment de lancer un service, convertissez vos secrets en variables 
    d'environnement. Pour cela, allez dans configuration avancée, puis dans 
    l’onglet Vault et collez le chemin du dossier dans le champ prévu à cet effet. 
    Vos clefs valeurs seront disponibles sous forme de variables d'environnement.`,
    /* spell-checker: enable */
    "buttons": (
        <>
            <Button color="secondary" type="submit">
                Cancel
            </Button>
            <Button color="primary" type="submit">
                Ok
            </Button>
        </>
    ),
    "isOpen": true,
    ...logCallbacks(["onClose", "onDoNotDisplayAgainValueChange"]),
};

export const VueFull = getStory(props);
