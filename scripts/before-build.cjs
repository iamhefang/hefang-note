const { writeFileSync, readFileSync } = require("fs")
const { resolve } = require("path")

const tauriFilePath = resolve(__dirname, "../src-tauri/tauri.conf.json")
const tauriTemplatePath = resolve(__dirname, "../src-tauri/tauri.conf.template.json")

const pkg = JSON.parse(readFileSync(resolve(__dirname, "../package.json"), "utf-8"))
const tauri = JSON.parse(readFileSync(tauriTemplatePath, "utf-8"))

tauri.package.productName = pkg.productName
tauri.package.version = pkg.version

writeFileSync(tauriFilePath, JSON.stringify(tauri, null, "    "))
