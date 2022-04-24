/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { execSync } from "child_process";
import { join as pathJoin, relative as pathRelative } from "path";
import * as fs from "fs";

const onyxiaUiDirPath = pathJoin(__dirname, "..", "..");

fs.writeFileSync(
    pathJoin(onyxiaUiDirPath, "dist", "package.json"),
    Buffer.from(
        JSON.stringify(
            (() => {
                const packageJsonParsed = JSON.parse(
                    fs
                        .readFileSync(pathJoin(onyxiaUiDirPath, "package.json"))
                        .toString("utf8"),
                );

                return {
                    ...packageJsonParsed,
                    "main": packageJsonParsed["main"].replace(/^dist\//, ""),
                    "types": packageJsonParsed["types"].replace(/^dist\//, ""),
                };
            })(),
            null,
            2,
        ),
        "utf8",
    ),
);

const commonThirdPartyDeps = (() => {
    const namespaceModuleNames = ["@emotion", "@mui"];
    const standaloneModuleNames = ["react", "@types/react", "tss-react"];

    return [
        ...namespaceModuleNames
            .map(namespaceModuleName =>
                fs
                    .readdirSync(
                        pathJoin(
                            onyxiaUiDirPath,
                            "node_modules",
                            namespaceModuleName,
                        ),
                    )
                    .map(
                        submoduleName =>
                            `${namespaceModuleName}/${submoduleName}`,
                    ),
            )
            .reduce((prev, curr) => [...prev, ...curr], []),
        ...standaloneModuleNames,
    ];
})();

const yarnHomeDirPath = pathJoin(onyxiaUiDirPath, ".yarn_home");

fs.rmSync(yarnHomeDirPath, { "recursive": true, "force": true });

fs.mkdirSync(yarnHomeDirPath);

const execYarnLink = (params: { targetModuleName?: string; cwd: string }) => {
    const { targetModuleName, cwd } = params;

    const cmd = [
        "yarn",
        "link",
        ...(targetModuleName !== undefined ? [targetModuleName] : []),
    ].join(" ");

    console.log(`$ cd ${pathRelative(onyxiaUiDirPath, cwd) || "."} && ${cmd}`);

    execSync(cmd, {
        cwd,
        "env": {
            ...process.env,
            "HOME": yarnHomeDirPath,
        },
    });
};

const testAppNames = ["spa"] as const;

const getTestAppPath = (testAppName: typeof testAppNames[number]) =>
    pathJoin(onyxiaUiDirPath, "src", "test", testAppName);

testAppNames.forEach(testAppName =>
    execSync("yarn install", { "cwd": getTestAppPath(testAppName) }),
);

console.log("=== Linking common dependencies ===");

const total = commonThirdPartyDeps.length;
let current = 0;

commonThirdPartyDeps.forEach(commonThirdPartyDep => {
    current++;

    console.log(`${current}/${total} ${commonThirdPartyDep}`);

    const localInstallPath = pathJoin(
        ...[
            onyxiaUiDirPath,
            "node_modules",
            ...(commonThirdPartyDep.startsWith("@")
                ? commonThirdPartyDep.split("/")
                : [commonThirdPartyDep]),
        ],
    );

    execYarnLink({ "cwd": localInstallPath });

    testAppNames.forEach(testAppName =>
        execYarnLink({
            "cwd": getTestAppPath(testAppName),
            "targetModuleName": commonThirdPartyDep,
        }),
    );
});

console.log("=== Linking in house dependencies ===");

execYarnLink({ "cwd": pathJoin(onyxiaUiDirPath, "dist") });

testAppNames.forEach(testAppName =>
    execYarnLink({
        "cwd": getTestAppPath(testAppName),
        "targetModuleName": "onyxia-ui",
    }),
);
