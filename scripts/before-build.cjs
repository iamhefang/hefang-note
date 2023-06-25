const { writeFileSync, readFileSync } = require("fs")
const { resolve } = require("path")
const tauriConfig = require("../src-tauri/tauri.conf.json")
const pkg = require("../package.json")
const toml = require("toml")
const json2toml = require("json2toml")

const cargoTomlPath = resolve(__dirname, "../src-tauri/Cargo.toml")
const tauriFilePath = resolve(__dirname, "../src-tauri/tauri.conf.json")

const tomlContent = readFileSync(cargoTomlPath, "utf-8")

tauriConfig.package.version = pkg.version
tauriConfig.package.productName = pkg.productName
const { package, ...tomlObj } = toml.parse(tomlContent)

writeFileSync(tauriFilePath, JSON.stringify(tauriConfig, null, 4))
writeFileSync(
  cargoTomlPath,
  json2toml(
    {
      package: {
        ...package,
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        authors: [pkg.author],
        license: pkg.license,
        repository: pkg.repository,
      },
      ...tomlObj,
    },
    { newlineAfterSection: true },
  ),
)
