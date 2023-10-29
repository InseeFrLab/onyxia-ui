import { join as pathJoin, basename as pathBasename } from "path";
import fs from "fs";
import { downloadAndUnzip } from "./tools/downloadAndUnzip";
import { muiComponentNameToFileName } from "../src/lib/icon";
import { assert } from "tsafe/assert";
import { transformCodebase } from "./tools/transformCodebase";

const rootDirPath = pathJoin(__dirname, "..");

(async () => {
    console.log(
        "NOTE: The following operation will take about a minute to complete if it's a first install",
    );

    const version = "5.14.15";

    const iconsDirPath = pathJoin(
        rootDirPath,
        "src",
        "assets",
        "material-icons",
    );

    await downloadAndUnzip({
        "url": `https://github.com/mui/material-ui/archive/refs/tags/v${version}.zip`,
        "destDirPath": iconsDirPath,
        "specificDirsToExtract": [
            `material-ui-${version}/packages/mui-icons-material/material-icons`,
        ],
        "doUseCache": true,
        "projectDirPath": rootDirPath,
    });

    fs.writeFileSync(
        pathJoin(iconsDirPath, ".gitignore"),
        Buffer.from("*", "utf8"),
    );

    transformCodebase({
        "srcDirPath": iconsDirPath,
        "destDirPath": pathJoin(
            rootDirPath,
            ".storybook",
            "static",
            pathBasename(iconsDirPath),
        ),
    });

    const iconFileNames = fs
        .readdirSync(iconsDirPath)
        .filter(name => name.endsWith(".svg"));

    const muiComponentNames = iconFileNames.map(fileName =>
        myDestRewriter({ "base": fileName }).replace(/\.js$/, ""),
    );

    muiComponentNames.forEach((muiComponentName, i) => {
        const reconstitutedFileName =
            muiComponentNameToFileName(muiComponentName);

        assert(
            iconFileNames.includes(reconstitutedFileName),
            [
                `File ${reconstitutedFileName} does not exist`,
                `(name derived from ${muiComponentName})`,
                `We should find ${iconFileNames[i]}`,
            ].join(" "),
        );
    });

    const tsCode = [
        ``,
        [
            `export type MuiIconsComponentName =`,
            muiComponentNames
                .map(
                    (muiIconId, i) =>
                        `    ${i === 0 ? "" : "| "}"${muiIconId}"`,
                )
                .join("\n"),
            `;`,
        ].join("\n"),
        ``,
    ].join("\n");

    const typeFilePath = pathJoin(
        rootDirPath,
        "src",
        "MuiIconsComponentName.ts",
    );

    fs.writeFileSync(typeFilePath, Buffer.from(tsCode, "utf8"));
})();

// Copy-paste from https://github.com/mui/material-ui/blob/master/packages/mui-icons-material/renameFilters/material-design-icons.mjs
const { myDestRewriter } = (() => {
    const singleDigitNumbers: any = [
        "Zero",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
    ];
    const twoDigitNumbers1: any = [
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
    ];

    function myDestRewriter(svgPathObj: { base: string }) {
        let fileName = svgPathObj.base;

        fileName = fileName
            .replace(/_([0-9]+)px\.svg/, ".js")
            .replace(/(^.)|(_)(.)/g, (match, p1, p2, p3) =>
                (p1 || p3).toUpperCase(),
            );

        if (fileName.startsWith("3dRotation")) {
            return `ThreeD${fileName.slice(2)}`;
        }

        if (fileName.startsWith("3p")) {
            return `ThreeP${fileName.slice(2)}`;
        }

        if (fileName.startsWith("30fps")) {
            return `ThirtyFps${fileName.slice(5)}`;
        }
        if (fileName.startsWith("60fps")) {
            return `SixtyFps${fileName.slice(5)}`;
        }
        if (fileName.startsWith("360")) {
            return `ThreeSixty${fileName.slice(3)}`;
        }

        if (/\dk/.test(fileName)) {
            return `${singleDigitNumbers[fileName[0]]}K${fileName.slice(2)}`;
        }

        if (/^\dmp/.test(fileName)) {
            return `${singleDigitNumbers[fileName[0]]}M${fileName.slice(2)}`;
        }
        if (/^1\dmp/.test(fileName)) {
            return `${twoDigitNumbers1[fileName[1]]}M${fileName.slice(3)}`;
        }
        if (/^2\dmp/.test(fileName)) {
            return `Twenty${singleDigitNumbers[fileName[1]]}M${fileName.slice(
                3,
            )}`;
        }

        if (fileName.startsWith("1x")) {
            return `TimesOne${fileName.slice(2)}`;
        }

        if (fileName.startsWith("3g")) {
            return `ThreeG${fileName.slice(2)}`;
        }
        if (fileName.startsWith("4g")) {
            return `FourG${fileName.slice(2)}`;
        }
        if (fileName.startsWith("5g")) {
            return `FiveG${fileName.slice(2)}`;
        }

        // All other names starting with a number between 10 and 19
        if (/^1\d/.test(fileName)) {
            return `${twoDigitNumbers1[fileName[1]]}${fileName.slice(2)}`;
        }

        return fileName;
    }

    return { myDestRewriter };
})();
