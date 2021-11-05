import { TextField } from "../TextField";
import { sectionName } from "./sectionName";
import { getStoryFactory, logCallbacks } from "./getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { TextField },
});

export default meta;

export const Vue1 = getStory({
    "defaultValue": "",
    "inputProps_aria-label": "the aria label",
    "label": "This is the label",
    "getIsValidValue": value => {
        console.log("getIsValidValue invoked: ", value);

        if (value.includes(" ")) {
            return { "isValidValue": false, "message": "Can't include spaces" };
        }

        return { "isValidValue": true };
    },
    "transformValueBeingTyped": value => {
        console.log("transformValueBeingTyped invoked: ", value);
        return value;
    },
    ...logCallbacks([
        "onEscapeKeyDown",
        "onEnterKeyDown",
        "onBlur",
        "onSubmit",
        "onValueBeingTypedChange",
    ]),
});

export const VuePassword = getStory({
    "defaultValue": "",
    "inputProps_aria-label": "password",
    "label": "Password",
    "type": "password",
    "getIsValidValue": value => {
        console.log("getIsValidValue invoked: ", value);

        if (value.includes(" ")) {
            return { "isValidValue": false, "message": "Can't include spaces" };
        }

        return { "isValidValue": true };
    },
    "transformValueBeingTyped": value => {
        console.log("transformValueBeingTyped invoked: ", value);
        return value;
    },
    ...logCallbacks([
        "onEscapeKeyDown",
        "onEnterKeyDown",
        "onBlur",
        "onSubmit",
        "onValueBeingTypedChange",
    ]),
});

export const VueWithHint = getStory({
    "helperText": "This is an helper text",
    "defaultValue": "",
    "inputProps_aria-label": "input with hint",
    "label": "Foo bar",
    "type": "text",
    "getIsValidValue": value => {
        console.log("getIsValidValue invoked: ", value);

        if (value.includes(" ")) {
            return { "isValidValue": false, "message": "Can't include spaces" };
        }

        return { "isValidValue": true };
    },
    "transformValueBeingTyped": value => {
        console.log("transformValueBeingTyped invoked: ", value);
        return value;
    },
    ...logCallbacks([
        "onEscapeKeyDown",
        "onEnterKeyDown",
        "onBlur",
        "onSubmit",
        "onValueBeingTypedChange",
    ]),
});

export const VueWithHintAndQuestionMark = getStory({
    "helperText": "This is an helper text",
    "questionMarkHelperText": "This is an extra helper text",
    "defaultValue": "",
    "inputProps_aria-label": "input with hint",
    "label": "Foo bar",
    "type": "text",
    "getIsValidValue": value => {
        console.log("getIsValidValue invoked: ", value);

        if (value.includes(" ")) {
            return { "isValidValue": false, "message": "Can't include spaces" };
        }

        return { "isValidValue": true };
    },
    "transformValueBeingTyped": value => {
        console.log("transformValueBeingTyped invoked: ", value);
        return value;
    },
    ...logCallbacks([
        "onEscapeKeyDown",
        "onEnterKeyDown",
        "onBlur",
        "onSubmit",
        "onValueBeingTypedChange",
    ]),
});
