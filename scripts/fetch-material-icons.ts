import { join as pathJoin } from "path";
import fs from "fs";
import { capitalize } from "tsafe/capitalize";
import { downloadAndUnzip } from "./tools/downloadAndUnzip";
import {
    wordByNumberEntries,
    muiComponentNameToFileName,
} from "../src/lib/icon";
import { assert } from "tsafe/assert";

const rootDirPath = pathJoin(__dirname, "..");

(async () => {
    console.log(
        "NOTE: The following operation will take about a minute to complete.",
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
            //For testing
            `material-ui-${version}/packages/mui-icons-material/lib/esm`,
        ],
        "doUseCache": true,
        "projectDirPath": rootDirPath,
    });

    const iconFileNames = fs
        .readdirSync(iconsDirPath)
        .filter(name => name.endsWith(".svg"));

    const muiComponentNames = iconFileNames
        .map(name => name.replace(/_24px.svg$/, ""))
        .map(name =>
            name.split("_").map(part => {
                for (const [start, word] of wordByNumberEntries) {
                    if (/[0-9]x[0-9]/.test(part)) {
                        return part;
                    }

                    if (part.startsWith(start)) {
                        return `${word}${capitalize(part.slice(start.length))}`;
                    }
                }
                return part;
            }),
        )
        .map(parts => parts.map(part => (part === "tenK" ? "oneKk" : part)))
        .map(parts => parts.map(capitalize).join(""));

    {
        //let errorCount = 0;

        muiComponentNames.forEach((muiComponentName, i) => {
            /*
            if( !fs.existsSync(pathJoin(iconsDirPath, `${muiComponentName}.js`)) ){
                errorCount++;
            }
            */

            assert(
                fs.existsSync(pathJoin(iconsDirPath, `${muiComponentName}.js`)),
                `There is no ${muiComponentName}.js Mui component, generated from ${iconFileNames[i]}`,
            );
        });

        /*
        console.log({ errorCount });

        if( Date.now() > 0 ){
            process.exit(0);
        }
        */

        fs.readdirSync(iconsDirPath)
            .filter(name => !name.endsWith(".svg"))
            .forEach(name =>
                fs.rmSync(pathJoin(iconsDirPath, name), { "recursive": true }),
            );
    }

    muiComponentNames.forEach((muiComponentName, i) => {
        const reconstitutedFileName =
            muiComponentNameToFileName(muiComponentName);

        console.log(i);

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
            `export type MuiIconId =`,
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

    const typeFilePath = pathJoin(iconsDirPath, "type.ts");

    fs.writeFileSync(typeFilePath, Buffer.from(tsCode, "utf8"));
})();

/*

const muiIconsDirPath = pathJoin(rootDirPath, "node_modules", "@mui/", "icons-material");

const tsCode = [
    `import { lazy } from "react";`,
    ``,
    [
        `export const muiComponentByIconId = {`,
        fs.readdirSync(muiIconsDirPath)
            .filter(name => name.endsWith(".js") && capitalize(name) === name)
            .map(name => name.replace(/\.js$/, ""))
            .map(componentName => `    "${uncapitalize(componentName)}": lazy(() => import("@mui/icons-material/${componentName}")) as any`)
            .join(",\n"),
        `};`
    ].join("\n"),
    ``,
    `export type MuiIconId = keyof typeof muiComponentByIconId;`,
    ``
].join("\n");

const destFilePath = pathJoin(rootDirPath, "src", "generated", "muiComponentByIconId.ts");

fs.mkdirSync(pathDirname(destFilePath), { "recursive": true });

fs.writeFileSync(
    pathJoin(rootDirPath, "src", "generated", "muiComponentByIconId.ts"),
    Buffer.from(tsCode, "utf8")
);
*/
