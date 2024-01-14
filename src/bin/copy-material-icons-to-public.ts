#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */

import { join as pathJoin } from "path";
import * as fs from "fs";
import { assert } from "tsafe/assert";
import { getProjectRoot } from "./tools/getProjectRoot";
import type { Equals } from "tsafe";
import { downloadAndUnzip } from "./tools/downloadAndUnzip";

const projectDirPath = process.cwd();

async function readPublicDirPath() {
    const viteConfigFilePath = (() => {
        for (const ext of [".js", ".ts"]) {
            const candidateFilePath = pathJoin(
                projectDirPath,
                `vite.config${ext}`,
            );

            if (!fs.existsSync(candidateFilePath)) {
                continue;
            }

            return candidateFilePath;
        }

        return undefined;
    })();

    const publicDirPath =
        viteConfigFilePath !== undefined
            ? await (async function getVitePublicDirPath() {
                  const viteConfig = fs
                      .readFileSync(viteConfigFilePath)
                      .toString("utf8");

                  if (!viteConfig.includes("publicDir")) {
                      return pathJoin(projectDirPath, "public");
                  }

                  const [, afterPublicDir] = viteConfig.split(
                      /\s["']?publicDir["']?\s*:/,
                  );

                  for (
                      let indexEnd = 0;
                      indexEnd < afterPublicDir.length;
                      indexEnd++
                  ) {
                      const {
                          default: path,
                          basename,
                          dirname,
                          delimiter,
                          extname,
                          format,
                          isAbsolute,
                          join,
                          normalize,
                          parse,
                          posix,
                          relative,
                          resolve,
                          sep,
                          toNamespacedPath,
                          win32,
                          ...rest
                      } = await import("path");
                      assert<Equals<keyof typeof rest, never>>();

                      const part = afterPublicDir
                          .substring(0, indexEnd)
                          .replace(/__dirname/g, `"${projectDirPath}"`);

                      let candidate: string;

                      try {
                          candidate = eval(part);
                      } catch {
                          continue;
                      }

                      if (typeof candidate !== "string") {
                          continue;
                      }

                      return candidate;
                  }

                  console.error(
                      `Can't parse the vite configuration please open an issue about it ${getRepoIssueUrl()}`,
                  );

                  process.exit(-1);
              })()
            : pathJoin(projectDirPath, "public");

    if (!fs.existsSync(publicDirPath)) {
        if (viteConfigFilePath === undefined) {
            console.error(
                [
                    "There is no public/ directory in the current working directory, we don't know your framework",
                    "you are not calling this script at the right location or we don't know your React framework",
                    `please submit an issue about it here ${getRepoIssueUrl()}`,
                ].join(" "),
            );

            process.exit(-1);
        }

        fs.mkdirSync(publicDirPath, { "recursive": true });
    }

    return publicDirPath;
}

export async function downloadMaterialIcons(params: { publicDirPath: string }) {
    const { publicDirPath } = params;

    const materialIconsDirPath = pathJoin(publicDirPath, "material-icons");

    if (fs.existsSync(materialIconsDirPath)) {
        fs.rmSync(materialIconsDirPath, { "recursive": true, "force": true });
    }

    console.log(
        "NOTE: Download of material icons takes a while if it's the first time you run this script",
    );

    const version = "5.14.15";

    await downloadAndUnzip({
        //"url": `https://github.com/mui/material-ui/archive/refs/tags/v${version}.zip`,
        "url": `https://github.com/InseeFrLab/onyxia-ui/releases/download/v0.0.1/material-ui-${version}-icons-only.zip`,
        "destDirPath": materialIconsDirPath,
        "specificDirsToExtract": [
            `material-ui-${version}/packages/mui-icons-material/material-icons`,
        ],
        "doUseCache": true,
        projectDirPath,
    });

    fs.writeFileSync(
        pathJoin(materialIconsDirPath, ".gitignore"),
        Buffer.from("*", "utf8"),
    );
}

function getRepoIssueUrl() {
    const reactDsfrRepoUrl = JSON.parse(
        fs
            .readFileSync(pathJoin(getProjectRoot(), "package.json"))
            .toString("utf8"),
    )
        ["repository"]["url"].replace(/^git/, "https:")
        .replace(/\.git$/, "");

    return `${reactDsfrRepoUrl}/issues`;
}

//Execute this only if the script is called directly (and not with import)
if (require.main === module) {
    (async () => {
        await downloadMaterialIcons({
            "publicDirPath": await readPublicDirPath(),
        });
    })();
}
